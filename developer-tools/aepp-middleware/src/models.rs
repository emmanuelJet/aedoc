#![allow(proc_macro_derive_resolution_fallback)]

use super::schema::channel_identifiers;
use super::schema::contract_calls;
use super::schema::contract_identifiers;
use super::schema::key_blocks;
use super::schema::key_blocks::dsl::*;
use super::schema::micro_blocks;
use super::schema::names;
use super::schema::names::dsl::*;
use super::schema::oracle_queries;
use super::schema::transactions;
use chrono::prelude::*;
use diesel::dsl::exists;
use diesel::dsl::select;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use diesel::sql_query;
extern crate serde_json;
use bigdecimal;
use bigdecimal::ToPrimitive;
use rust_decimal::Decimal;
use serde_json::Number;
use std::collections::HashMap;
use std::fmt;
use std::str::FromStr;

use middleware_result::{MiddlewareError, MiddlewareResult};
use node::Node;

use loader::SQLCONNECTION;

#[derive(
    Associations, Deserialize, Identifiable, Queryable, QueryableByName, Hash, PartialEq, Eq,
)]
#[table_name = "key_blocks"]
#[has_many(micro_blocks)]
pub struct KeyBlock {
    #[sql_type = "diesel::sql_types::Int4"]
    pub id: i32,
    pub hash: String,
    pub height: i64,
    pub miner: String,
    pub beneficiary: String,
    pub pow: String,
    pub nonce: bigdecimal::BigDecimal,
    pub prev_hash: String,
    pub prev_key_hash: String,
    pub state_hash: String,
    pub target: i64,
    pub time: i64,
    pub version: i32,
    pub info: String,
}

impl KeyBlock {
    pub fn from_json_key_block(jb: &JsonKeyBlock) -> MiddlewareResult<KeyBlock> {
        let n: u64 = match jb.nonce.as_u64() {
            Some(val) => val,
            None => 0,
        };
        Ok(KeyBlock {
            id: -1, // TODO
            hash: jb.hash.clone(),
            height: jb.height,
            info: jb.info.to_owned(),
            miner: jb.miner.clone(),
            nonce: bigdecimal::BigDecimal::from(n),
            beneficiary: jb.beneficiary.clone(),
            pow: format!("{:?}", jb.pow),
            prev_hash: jb.prev_hash.clone(),
            prev_key_hash: jb.prev_key_hash.clone(),
            state_hash: jb.state_hash.clone(),
            target: jb.target.clone(),
            time: jb.time,
            version: jb.version,
        })
    }

    pub fn top_height(conn: &PgConnection) -> MiddlewareResult<i64> {
        let _height: Option<i64> = key_blocks.select(diesel::dsl::max(height)).first(conn)?;
        Ok(_height?)
    }

    /**
     * return the height that has time >= of the epoch input value
     */
    pub fn height_at_epoch(_conn: &PgConnection, epoch: i64) -> MiddlewareResult<Option<i64>> {
        let rows = SQLCONNECTION.get()?.query(
            "SELECT MIN(height) FROM key_blocks WHERE time_ >= $1",
            &[&epoch],
        )?;
        if rows.len() == 0 {
            Ok(None)
        } else {
            Ok(rows.get(0).get(0))
        }
    }

    pub fn load_at_height(conn: &PgConnection, _height: i64) -> Option<KeyBlock> {
        let block = match key_blocks::table
            .filter(height.eq(_height))
            .first::<KeyBlock>(conn)
        {
            Ok(x) => x,
            Err(y) => {
                error!("Error loading key block: {:?}", y);
                return None;
            }
        };
        Some(block)
    }

    pub fn load_at_hash(conn: &PgConnection, _hash: &String) -> Option<KeyBlock> {
        let mut blocks = match key_blocks::table
            .filter(hash.eq(_hash))
            .load::<KeyBlock>(conn)
        {
            Ok(x) => x,
            Err(y) => {
                error!("Error loading key block: {:?}", y);
                return None;
            }
        };
        Some(blocks.pop()?)
    }

    pub fn height_exists(conn: &PgConnection, h: i64) -> bool {
        match select(exists(key_blocks.filter(height.eq(h)))).get_result(conn) {
            Ok(result) => result,
            _ => false,
        }
    }

    pub fn fees(sql_conn: &postgres::Connection, _height: i32) -> Decimal {
        let sql =
            "select COALESCE(sum(t.fee),0) from transactions t where block_height=$1".to_string();
        for row in &sql_conn.query(&sql, &[&_height]).unwrap() {
            // TODO
            return row.get(0);
        }
        0.into()
    }
}

#[derive(Insertable)]
#[table_name = "key_blocks"]
pub struct InsertableKeyBlock {
    pub hash: String,
    pub height: i64,
    pub info: String,
    pub miner: String,
    pub nonce: bigdecimal::BigDecimal,
    pub beneficiary: String,
    pub pow: String,
    pub prev_hash: String,
    pub prev_key_hash: String,
    pub state_hash: String,
    pub target: i64,
    pub time: i64,
    pub version: i32,
}

impl InsertableKeyBlock {
    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        use diesel::dsl::insert_into;
        use schema::key_blocks::dsl::*;
        let generated_ids: Vec<i32> = insert_into(key_blocks)
            .values(self)
            .returning(id)
            .get_results(&*conn)?;
        Ok(generated_ids[0])
    }

    pub fn from_json_key_block(jb: &JsonKeyBlock) -> MiddlewareResult<InsertableKeyBlock> {
        //TODO: fix this.
        let n: u64 = match jb.nonce.as_u64() {
            Some(val) => val,
            None => 0,
        };
        Ok(InsertableKeyBlock {
            hash: jb.hash.clone(),
            height: jb.height,
            miner: jb.miner.clone(),
            nonce: bigdecimal::BigDecimal::from(n),
            beneficiary: jb.beneficiary.clone(),
            pow: format!("{:?}", jb.pow),
            prev_hash: jb.prev_hash.clone(),
            prev_key_hash: jb.prev_key_hash.clone(),
            state_hash: jb.state_hash.clone(),
            target: jb.target.clone(),
            time: jb.time,
            version: jb.version,
            info: jb.info.to_owned(),
        })
    }
}

/*
In a better world, the serialization object would be the same as we
use for persistence, but in this one right now that doesn't work,
because serde_json needs serde_json::Number, and diesel needs a
bigdecimal::BigDecimal. So this struct exists to be pulled from the
JSON.  If @newby gets smart enough he will write the implementations
for these missing methods.
*/
#[derive(Serialize, Deserialize, Debug)]
pub struct JsonKeyBlock {
    pub hash: String,
    pub height: i64,
    pub info: String,
    pub miner: String,
    pub beneficiary: String,
    #[serde(default = "zero")]
    pub nonce: Number,
    #[serde(default = "zero_vec_i32")]
    pub pow: Vec<i32>,
    pub prev_hash: String,
    pub prev_key_hash: String,
    pub state_hash: String,
    pub target: i64,
    pub time: i64,
    pub version: i32,
}

impl JsonKeyBlock {
    pub fn eq(&self, other: &JsonKeyBlock) -> bool {
        (self.hash.eq(&other.hash) &&
         self.height == other.height &&
         self.miner.eq(&other.miner) &&
         self.info.eq(&other.info) &&
                self.beneficiary.eq(&other.beneficiary) &&
//                self.nonce == other.nonce && // These don't compare well. TODO -- fix
                self.pow.len() == other.pow.len() && // TODO <-- fix
                self.prev_hash.eq(&other.prev_hash) &&
                self.prev_key_hash.eq(&other.prev_key_hash) &&
                self.state_hash.eq(&other.state_hash) &&
                self.target == other.target &&
                self.time == other.time &&
                self.version == other.version)
    }

    pub fn from_key_block(kb: &KeyBlock) -> JsonKeyBlock {
        let pows: Vec<serde_json::Value> = serde_json::from_str(&kb.pow).unwrap();
        let mut pows2 = Vec::<i32>::new();
        for val in pows {
            pows2.push(i32::from_str(&serde_json::to_string(&val).unwrap()).unwrap());
        }
        JsonKeyBlock {
            hash: kb.hash.clone(),
            height: kb.height,
            info: kb.info.to_owned(),
            miner: kb.miner.clone(),
            beneficiary: kb.beneficiary.clone(),
            nonce: serde_json::Number::from_f64(kb.nonce.to_f64().unwrap()).unwrap(),
            pow: pows2,
            prev_hash: kb.prev_hash.clone(),
            prev_key_hash: kb.prev_key_hash.clone(),
            state_hash: kb.state_hash.clone(),
            target: kb.target,
            time: kb.time,
            version: kb.version,
        }
    }
}

fn zero() -> Number {
    serde_json::Number::from_f64(0.0).unwrap()
}

fn zero_vec_i32() -> Vec<i32> {
    vec![0]
}

#[derive(
    Deserialize, Associations, Identifiable, Queryable, QueryableByName, Hash, Eq, PartialEq,
)]
#[table_name = "micro_blocks"]
#[belongs_to(KeyBlock)]
#[has_many(transactions)]
pub struct MicroBlock {
    pub id: i32,
    pub key_block_id: i32,
    pub hash: String,
    pub pof_hash: String,
    pub prev_hash: String,
    pub prev_key_hash: String,
    pub signature: String,
    pub time: i64,
    pub state_hash: String,
    pub txs_hash: String,
    pub version: i32,
}

impl MicroBlock {
    pub fn get_microblock_hashes_for_key_block_hash(
        sql_conn: &postgres::Connection,
        kb_hash: &String,
    ) -> Option<Vec<String>> {
        let sql = format!(
            "SELECT mb.hash FROM micro_blocks mb, key_blocks kb WHERE \
             mb.key_block_id=kb.id and kb.hash='{}' \
             ORDER BY mb.time_ ASC",
            kb_hash
        );
        let mut micro_block_hashes = Vec::new();
        for row in &sql_conn.query(&sql, &[]).unwrap() {
            micro_block_hashes.push(row.get(0));
        }
        Some(micro_block_hashes)
    }

    pub fn get_transaction_count(sql_conn: &postgres::Connection, mb_hash: &String) -> i64 {
        let sql = format!(
            "select count(t.*) from transactions t, micro_blocks m where t.micro_block_id = m.id and m.hash = '{}'",
            mb_hash);
        let mut micro_block_hashes = Vec::new();
        for row in &sql_conn.query(&sql, &[]).unwrap() {
            micro_block_hashes.push(row.get(0));
        }
        micro_block_hashes[0]
    }
}

#[derive(Insertable)]
#[table_name = "micro_blocks"]
#[derive(Serialize, Deserialize)]
pub struct InsertableMicroBlock {
    pub key_block_id: Option<i32>,
    pub hash: String,
    pub pof_hash: String,
    pub prev_hash: String,
    pub prev_key_hash: String,
    pub signature: String,
    pub time: i64,
    pub state_hash: String,
    pub txs_hash: String,
    pub version: i32,
}

impl InsertableMicroBlock {
    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        use diesel::dsl::insert_into;
        use schema::micro_blocks::dsl::*;
        let generated_ids: Vec<i32> = insert_into(micro_blocks)
            .values(self)
            .returning(id)
            .get_results(&*conn)?;
        Ok(generated_ids[0])
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JsonGeneration {
    pub key_block: JsonKeyBlock,
    pub micro_blocks: Vec<String>,
}

impl JsonGeneration {
    pub fn get_generation_at_height(
        sql_conn: &postgres::Connection,
        conn: &PgConnection,
        _height: i64,
    ) -> Option<JsonGeneration> {
        let key_block = match KeyBlock::load_at_height(conn, _height) {
            Some(x) => x,
            None => {
                debug!("Didn't find key block at height {} in DB", _height);
                return None;
            }
        };
        debug!("Serving generation {} from DB", _height);
        let sql = format!(
            "SELECT hash FROM micro_blocks WHERE key_block_id={} ORDER BY time_ asc",
            key_block.id
        );
        let mut micro_block_hashes = Vec::new();
        for row in &sql_conn.query(&sql, &[]).unwrap() {
            micro_block_hashes.push(row.get(0));
        }
        Some(JsonGeneration {
            key_block: JsonKeyBlock::from_key_block(&key_block),
            micro_blocks: micro_block_hashes,
        })
    }

    pub fn eq(&self, other: &JsonGeneration) -> bool {
        if self.micro_blocks.len() != other.micro_blocks.len() {
            debug!(
                "Different lengths of microblocks array: {} vs {}",
                self.micro_blocks.len(),
                other.micro_blocks.len()
            );
            return false;
        }
        let mut mb1 = self.micro_blocks.clone();
        mb1.sort();
        let mut mb2 = other.micro_blocks.clone();
        mb2.sort();
        debug!("\nComparing {:?} to \n{:?}\n", mb1, mb2);
        for i in 0..mb1.len() {
            if mb1[i] != mb2[i] {
                debug!("Microblock hashes don't match: {} vs {}", mb1[i], mb2[i]);
                return false;
            }
        }
        self.key_block.eq(&other.key_block)
    }
}

#[derive(Queryable, QueryableByName, Identifiable, Serialize, Deserialize, Associations, Clone)]
#[table_name = "transactions"]
#[belongs_to(MicroBlock)]
pub struct Transaction {
    pub id: i32,
    pub micro_block_id: Option<i32>,
    pub block_height: i32,
    pub block_hash: String,
    pub hash: String,
    pub signatures: Option<String>,
    pub tx_type: String,
    pub tx: serde_json::Value,
    pub fee: bigdecimal::BigDecimal,
    pub size: i32,
    pub valid: bool,
    pub encoded_tx: Option<String>,
}

#[derive(Serialize)]
pub struct Rate {
    pub count: i64,
    pub amount: rust_decimal::Decimal,
    pub date: String,
}

impl Transaction {
    pub fn load_at_hash(conn: &PgConnection, _hash: &String) -> Option<Transaction> {
        let sql = format!("select * from transactions where hash='{}'", _hash);
        let mut _transactions: Vec<Transaction> = sql_query(sql).load(conn).unwrap();
        match _transactions.pop() {
            Some(tx) => Some(Transaction::check_encoded(&tx)),
            _ => None,
        }
    }

    pub fn load_for_micro_block(conn: &PgConnection, mb_hash: &String) -> Option<Vec<Transaction>> {
        let sql = format!("select t.* from transactions t, micro_blocks mb where t.micro_block_id = mb.id and mb.hash='{}'", mb_hash);
        let _transactions: Vec<Transaction> = sql_query(sql).load(conn).unwrap();
        let txs = _transactions
            .iter()
            .map(Transaction::check_encoded)
            .collect();
        Some(txs)
    }

    pub fn rate(
        sql_conn: &postgres::Connection,
        from: NaiveDate,
        to: NaiveDate,
    ) -> MiddlewareResult<Vec<Rate>> {
        let mut v = vec![];
        for row in &sql_conn.query(
            "select count(1), sum(cast(tx->>'amount' as decimal)), date(to_timestamp(time_/1000)) as _date from \
             transactions t, micro_blocks m where \
             m.id=t.micro_block_id and tx_type = 'SpendTx' and \
             date(to_timestamp(time_/1000)) > $1 and \
             date(to_timestamp(time_/1000)) < $2 \
             group by _date order by _date",
            &[&from, &to])?
        {
            let dt: NaiveDate = row.get(2);
            v.push(Rate {count: row.get(0), amount: row.get(1), date: dt.format("%Y-%m-%d").to_string() });
        }
        Ok(v)
    }

    pub fn check_encoded(transaction: &Transaction) -> Transaction {
        match &transaction.encoded_tx {
            Some(encoded_tx) => {
                let mut tx = transaction.clone();
                tx.tx = Transaction::decode_tx(encoded_tx);
                tx
            }
            _ => transaction.clone(),
        }
    }

    pub fn decode_tx(encoded_tx: &String) -> serde_json::Value {
        serde_json::from_str(&String::from_utf8(base64::decode(&encoded_tx).unwrap()).unwrap())
            .unwrap()
    }

    pub fn deserialize_signatures(sig: &Option<String>) -> Option<Vec<String>> {
        match sig {
            Some(result) => {
                let signatures: Vec<String> = result.split(' ').map(|s| s.to_string()).collect();
                Some(signatures)
            }
            _ => None,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JsonTransaction {
    pub block_height: i32,
    pub block_hash: String,
    pub hash: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub signatures: Option<Vec<String>>,
    pub tx: serde_json::Value,
}

impl JsonTransaction {
    pub fn from_transaction(t: &Transaction) -> JsonTransaction {
        let signatures = Transaction::deserialize_signatures(&t.signatures);
        JsonTransaction {
            block_height: t.block_height,
            block_hash: t.block_hash.clone(),
            hash: t.hash.clone(),
            signatures,
            tx: Transaction::check_encoded(t).tx,
        }
    }

    pub fn is_oracle_query(&self) -> bool {
        self.tx["type"].as_str() == Some("OracleQueryTx")
    }

    pub fn is_contract_creation(&self) -> bool {
        self.tx["type"].as_str() == Some("ContractCreateTx")
    }

    pub fn is_contract_call(&self) -> bool {
        self.tx["type"].as_str() == Some("ContractCallTx")
    }

    pub fn is_channel_creation(&self) -> bool {
        self.tx["type"].as_str() == Some("ChannelCreateTx")
    }

    pub fn is_name_transaction(&self) -> bool {
        if let Some(ttype) = self.tx["type"].as_str() {
            return ttype == "NameClaimTx"
                || ttype == "NameRevokeTx"
                || ttype == "NameTransferTx"
                || ttype == "NameUpdateTx";
        }
        false
    }
}

#[derive(Serialize, Deserialize)]
pub struct JsonTransactionList {
    pub transactions: Vec<JsonTransaction>,
}

#[derive(Insertable)]
#[table_name = "transactions"]
pub struct InsertableTransaction {
    pub micro_block_id: Option<i32>,
    pub block_height: i32,
    pub block_hash: String,
    pub hash: String,
    pub signatures: Option<String>,
    pub tx_type: String,
    pub fee: bigdecimal::BigDecimal,
    pub size: i32,
    pub tx: serde_json::Value,
    pub encoded_tx: Option<String>,
}

impl InsertableTransaction {
    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        use diesel::dsl::insert_into;
        use schema::transactions::dsl::*;
        let generated_ids: Vec<i32> = insert_into(transactions)
            .values(self)
            .returning(id)
            .get_results(&*conn)?;
        Ok(generated_ids[0])
    }

    pub fn from_json_transaction(
        jt: &JsonTransaction,
        tx_type: String,
        micro_block_id: Option<i32>,
    ) -> MiddlewareResult<InsertableTransaction> {
        let signatures = match &jt.signatures {
            Some(sig) => {
                let mut sig_str = String::new();
                for i in 0..sig.len() {
                    if i > 0 {
                        sig_str.push_str(" ");
                    }
                    sig_str.push_str(&sig[i].clone());
                }
                Some(sig_str)
            }
            _ => None,
        };

        let fee_number: serde_json::Number =
            serde::de::Deserialize::deserialize(jt.tx["fee"].to_owned())?;
        let fee_str = fee_number.to_string();
        let fee = bigdecimal::BigDecimal::from_str(&fee_str)?.with_scale(0);
        let cleaned_tx = InsertableTransaction::clean_tx_string(&jt.tx.to_string());
        let encoded_tx = Some(base64::encode(&jt.tx.to_string()));
        // the above with_scale(0) seems to suppress a weird bug, should not be necessary
        Ok(InsertableTransaction {
            micro_block_id,
            block_height: jt.block_height,
            block_hash: jt.block_hash.clone(),
            hash: jt.hash.clone(),
            signatures,
            tx_type,
            fee,
            size: jt.tx.to_string().len() as i32,
            tx: serde_json::from_str(&cleaned_tx)?,
            encoded_tx,
        })
    }

    pub fn clean_tx_string(tx_str: &str) -> String {
        tx_str.replace("\\u0000", "")
    }
}

pub fn size_at_height(
    sql_conn: &postgres::Connection,
    _height: i32,
) -> MiddlewareResult<Option<i64>> {
    for row in &sql_conn.query(
        "select sum(size) from transactions where block_height <= $1",
        &[&_height],
    )? {
        let result: i64 = row.get(0);
        return Ok(Some(result));
    }
    Ok(None)
}

pub fn count_at_height(
    sql_conn: &postgres::Connection,
    _height: i32,
) -> MiddlewareResult<Option<i64>> {
    for row in &sql_conn.query(
        "select count(1) from transactions where block_height <= $1",
        &[&_height],
    )? {
        let result: i64 = row.get(0);
        return Ok(Some(result));
    }
    Ok(None)
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub enum WsOp {
    subscribe,
    unsubscribe,
}

#[derive(Serialize, Deserialize, Clone, Eq, PartialEq, Hash, Debug)]
pub enum WsPayload {
    key_blocks = 0,
    micro_blocks = 1,
    transactions = 2,
    tx_update = 3,
    object,
}

impl fmt::Display for WsPayload {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WsMessage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub op: Option<WsOp>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub payload: Option<WsPayload>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target: Option<String>,
}

#[derive(Insertable)]
#[table_name = "oracle_queries"]
pub struct InsertableOracleQuery {
    pub oracle_id: String,
    pub query_id: String,
    pub transaction_id: i32,
}

impl InsertableOracleQuery {
    pub fn from_tx(tx_id: i32, tx: &JsonTransaction) -> Option<Self> {
        Some(InsertableOracleQuery {
            oracle_id: String::from(tx.tx["oracle_id"].as_str()?),
            query_id: super::hashing::gen_oracle_query_id(
                &String::from(tx.tx["sender_id"].as_str()?),
                tx.tx["nonce"].as_i64()?,
                &String::from(tx.tx["oracle_id"].as_str()?),
            ),
            transaction_id: tx_id,
        })
    }
    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        use diesel::dsl::insert_into;
        use schema::oracle_queries::dsl::*;
        let generated_ids: Vec<i32> = insert_into(oracle_queries)
            .values(self)
            .returning(id)
            .get_results(&*conn)?;
        Ok(generated_ids[0])
    }
}

#[derive(Insertable)]
#[table_name = "contract_identifiers"]
pub struct InsertableContractIdentifier {
    pub contract_identifier: String,
    pub transaction_id: i32,
}

impl InsertableContractIdentifier {
    pub fn from_tx(tx_id: i32, tx: &JsonTransaction) -> Option<Self> {
        Some(InsertableContractIdentifier {
            contract_identifier: super::hashing::gen_contract_id(
                &String::from(tx.tx["owner_id"].as_str()?),
                tx.tx["nonce"].as_i64()?,
            ),
            transaction_id: tx_id,
        })
    }
    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        debug!("Saving contract info");
        use diesel::dsl::insert_into;
        use schema::contract_identifiers::dsl::*;
        let generated_ids: Vec<i32> = insert_into(contract_identifiers)
            .values(self)
            .returning(id)
            .get_results(&*conn)?;
        Ok(generated_ids[0])
    }
}

pub fn get_contract_bytecode(contract_id: &str) -> MiddlewareResult<Option<String>> {
    let rows = SQLCONNECTION.get()?.query(
        "SELECT CAST(t.tx->>'code' AS VARCHAR) AS CODE FROM \
         transactions t, contract_identifiers ci WHERE \
         ci.transaction_id=t.id AND \
         ci.contract_identifier=$1",
        &[&contract_id.to_string()],
    )?;
    if rows.len() == 0 {
        return Ok(None);
    }
    let bytecode = rows.get(0).get(0);
    debug!("bytecode: {:?}", bytecode);
    Ok(Some(bytecode))
}

#[derive(Insertable)]
#[table_name = "channel_identifiers"]
pub struct InsertableChannelIdentifier {
    pub channel_identifier: String,
    pub transaction_id: i32,
}

impl InsertableChannelIdentifier {
    pub fn from_tx(tx_id: i32, tx: &JsonTransaction) -> Option<Self> {
        Some(InsertableChannelIdentifier {
            channel_identifier: super::hashing::gen_channel_id(
                &String::from(tx.tx["initiator_id"].as_str()?),
                tx.tx["nonce"].as_i64()?,
                &String::from(tx.tx["responder_id"].as_str()?),
            ),
            transaction_id: tx_id,
        })
    }
    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        debug!("Saving channel info");
        use diesel::dsl::insert_into;
        use schema::channel_identifiers::dsl::*;
        let generated_ids: Vec<i32> = insert_into(channel_identifiers)
            .values(self)
            .returning(id)
            .get_results(&*conn)?;
        Ok(generated_ids[0])
    }
}

#[derive(Insertable)]
#[table_name = "names"]
pub struct InsertableName {
    pub name: String,
    pub name_hash: String,
    pub tx_hash: String,
    pub created_at_height: i64,
    pub owner: String,
    pub expires_at: i64,
    pub pointers: Option<serde_json::Value>,
    pub transaction_id: i32,
}

impl InsertableName {
    pub const NAME_CLAIM_MAX_EXPIRATION: i64 = 50000;

    pub fn new(
        _name: &String,
        _name_hash: &String,
        _tx_hash: &String,
        _created_at_height: i64,
        _owner: &str,
        _expires_at: i64,
        _transaction_id: i32,
    ) -> Self {
        InsertableName {
            name: _name.to_string(),
            name_hash: _name_hash.to_string(),
            tx_hash: _tx_hash.to_string(),
            created_at_height: _created_at_height,
            owner: _owner.to_string(),
            expires_at: _expires_at,
            pointers: None,
            transaction_id: _transaction_id,
        }
    }

    pub fn new_from_transaction(tx_id: i32, transaction: &JsonTransaction) -> Option<Self> {
        let ttype = transaction.tx["type"].as_str()?;
        if ttype != "NameClaimTx" {
            return None;
        }
        let _name = transaction.tx["name"].as_str()?;
        let _name_hash = super::hashing::get_name_id(&_name).unwrap(); // TODO
        let _tx_hash = transaction.hash.clone();
        let _account_id = transaction.tx["account_id"].as_str()?;
        let _expires_at =
            InsertableName::NAME_CLAIM_MAX_EXPIRATION + transaction.block_height as i64;

        Some(InsertableName::new(
            &_name.to_string(),
            &_name_hash,
            &_tx_hash,
            transaction.block_height as i64,
            &_account_id,
            _expires_at,
            tx_id,
        ))
    }

    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        use diesel::dsl::insert_into;
        use schema::names::dsl::*;
        let generated_ids: Vec<i32> = insert_into(names)
            .values(self)
            .returning(id)
            .get_results(&*conn)
            .unwrap();
        Ok(generated_ids[0])
    }
}

#[derive(AsChangeset, Identifiable, Queryable, QueryableByName, Deserialize, Serialize)]
#[table_name = "names"]
pub struct Name {
    #[serde(skip_serializing)]
    pub id: i32,
    pub name: String,
    pub name_hash: String,
    pub tx_hash: String,
    pub created_at_height: i64,
    pub owner: String,
    pub expires_at: i64,
    pub pointers: Option<serde_json::Value>,
    #[serde(skip_serializing)]
    pub transaction_id: i32,
}

impl Name {
    pub fn load_for_hash(connection: &PgConnection, _name_hash: &str) -> Option<Self> {
        let sql = format!("select * from names where name_hash='{}'", _name_hash);
        let mut _names: Vec<Name> = sql_query(sql).load(connection).unwrap();
        Some(_names.pop()?)
    }

    pub fn update(&self, connection: &PgConnection) -> MiddlewareResult<usize> {
        match diesel::update(names::table)
            .filter(name_hash.eq(self.name_hash.clone()))
            .set(self)
            .execute(connection)
        {
            Ok(x) => Ok(x),
            Err(e) => Err(MiddlewareError::new(&e.to_string())),
        }
    }
    pub fn delete(&self, connection: &PgConnection) -> MiddlewareResult<usize> {
        use schema::names::dsl::*;
        match diesel::delete(names.filter(id.eq(self.id))).execute(connection) {
            Ok(x) => Ok(x),
            Err(e) => Err(MiddlewareError::new(&e.to_string())),
        }
    }
    pub fn find_by_name(connection: &PgConnection, query: &str) -> MiddlewareResult<Vec<Self>> {
        use schema::names::dsl::*;
        let result = names
            .filter(name.like(query))
            .then_order_by(expires_at.desc())
            .load::<Self>(connection);
        match result {
            Ok(x) => Ok(x),
            Err(e) => Err(MiddlewareError::new(&e.to_string())),
        }
    }
}

#[derive(Queryable, QueryableByName)]
#[table_name = "contract_calls"]
pub struct ContractCall {
    pub id: i32,
    pub transaction_id: i32,
    pub contract_id: String,
    pub caller_id: String,
    pub arguments: serde_json::Value,
    pub callinfo: Option<serde_json::Value>,
    pub result: Option<serde_json::Value>,
}

#[derive(Insertable)]
#[table_name = "contract_calls"]
pub struct InsertableContractCall {
    pub transaction_id: i32,
    pub contract_id: String,
    pub caller_id: String,
    pub arguments: serde_json::Value,
    pub callinfo: Option<serde_json::Value>,
    pub result: Option<serde_json::Value>,
}

impl InsertableContractCall {
    /**
     * This function fills in the InsertableContractCall from values returned by the
     * node and standalone compiler.
     *
     * TODO: refactor, massively.
     */
    pub fn request(
        url: &str,
        source: &JsonTransaction,
        _transaction_id: i32,
    ) -> MiddlewareResult<Option<Self>> {
        match source.tx["type"].as_str() {
            Some(x) => {
                if x != "ContractCallTx" {
                    return Err(MiddlewareError::new(
                        format!("Wrong tx_type in {:?}", source).as_str(),
                    ));
                }
            }
            None => {
                return Err(MiddlewareError::new(
                    format!("No tx_type in {:?}", source).as_str(),
                ))
            }
        }
        let calldata = source.tx["call_data"].as_str()?;
        let contract_id = source.tx["contract_id"].as_str()?;
        let caller_id = source.tx["caller_id"].as_str()?;
        let full_url = format!("{}/decode-calldata/bytecode", url);
        debug!(
            "calldata={}, contract_id={}, caller_id={}",
            calldata, contract_id, caller_id
        );
        let mut params: HashMap<String, String> = HashMap::new();
        params.insert("calldata".to_string(), calldata.to_string());
        match get_contract_bytecode(&contract_id)? {
            Some(x) => params.insert("bytecode".to_string(), x),
            None => {
                info!("No bytecode found for contract with id {}", contract_id);
                return Ok(None); // not found. happens.
            }
        };
        debug!("Params: {:?}", params);
        let client = reqwest::Client::new();
        let arguments: serde_json::Value = match client.post(&full_url).json(&params).send() {
            Ok(mut data) => {
                let output = data.text().unwrap();
                serde_json::from_str(&output)?
            }
            Err(err) => {
                debug!("Error occurred while decoding call data: {:?}", err);
                serde_json::from_str("{}")?
            }
        };
        // TODO -- clean up this hacky shit
        let node = Node::new(std::env::var("NODE_URL")?);
        // ^^^^^ should be safe here, but this needs to be fixed ASAP
        let callinfo = node.transaction_info(&source.hash)?["call_info"].to_owned();
        debug!("callinfo: {:?}", callinfo.to_string());
        debug!("arguments: {:?}", arguments);

        /* let mut call_result = None;
        if (callinfo["return_type"].as_str()? == "ok") {
            params.remove(&"calldata".to_string())?;
            params.insert(
                "function".to_string(),
                String::from(arguments["function"].as_str()?),
            );
            params.insert(
                "return".to_string(),
                String::from(callinfo["return_value"].as_str()?),
            );
            debug!("returndata input: {:?}", params);
            call_result = match client
                .post(&format!("{}/decode-returndata/bytecode", url))
                .json(&params)
                .send() {
                    Ok(mut response) => {
                        debug!("Result decode response {:?} ", response);
                        Some(serde_json::from_str(&response.text()?)?)
                    },
                    Err(err) => {
                        debug!("Error occurred while decoding call result: {:?}", err);
                        None
                    },
                }
        } */
        Ok(Some(Self {
            transaction_id: _transaction_id,
            contract_id: contract_id.to_string(),
            caller_id: caller_id.to_string(),
            arguments,
            callinfo: Some(callinfo),
            result: None,
        }))
    }

    pub fn save(&self, conn: &PgConnection) -> MiddlewareResult<i32> {
        use diesel::dsl::insert_into;
        use schema::contract_calls::dsl::*;
        let generated_ids: Vec<i32> = insert_into(contract_calls)
            .values(self)
            .returning(id)
            .get_results(&*conn)
            .unwrap();
        Ok(generated_ids[0])
    }
}

#[derive(Serialize, Deserialize)]
pub struct ContractVerification {
    pub contract_id: String,
    pub source: String,
    pub compiler: String,
}

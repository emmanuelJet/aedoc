package com.kryptokrauts.aeternity.generated.api;

import com.kryptokrauts.aeternity.sdk.domain.secret.impl.BaseKeyPair;
import com.kryptokrauts.aeternity.sdk.exception.TransactionCreateException;
import com.kryptokrauts.aeternity.sdk.service.account.domain.AccountResult;
import com.kryptokrauts.aeternity.sdk.service.transaction.domain.PostTransactionResult;
import com.kryptokrauts.aeternity.sdk.service.transaction.type.model.SpendTransactionModel;
import io.vertx.ext.unit.TestContext;
import java.math.BigInteger;
import java.util.Optional;
import org.bouncycastle.crypto.CryptoException;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class TransactionSpendApiTest extends BaseTest {

  /**
   * create an unsigned native spend transaction
   *
   * @param context
   */
  @Test
  public void buildNativeSpendTransactionTest(TestContext context) {
    this.executeTest(
        context,
        t -> {
          String sender = keyPairService.generateBaseKeyPair().getPublicKey();
          String recipient = keyPairService.generateBaseKeyPair().getPublicKey();
          BigInteger amount = BigInteger.valueOf(1000);
          String payload = "payload";
          BigInteger ttl = BigInteger.valueOf(100);
          BigInteger nonce = BigInteger.valueOf(5);

          // sender, recipient, amount, payload, ttl, nonce

          SpendTransactionModel spendTx =
              SpendTransactionModel.builder()
                  .sender(sender)
                  .recipient(recipient)
                  .amount(amount)
                  .payload(payload)
                  .ttl(ttl)
                  .nonce(nonce)
                  .build();

          String unsignedTxNative =
              aeternityServiceNative
                  .transactions
                  .asyncCreateUnsignedTransaction(spendTx)
                  .blockingGet();

          String unsignedTxDebug =
              aeternityServiceDebug.transactions.blockingCreateUnsignedTransaction(spendTx);

          context.assertEquals(unsignedTxDebug, unsignedTxNative);
        });
  }

  @Test
  public void postSpendSelfSignTxTest(TestContext context) {
    this.executeTest(
        context,
        t -> {

          // get the currents accounts nonce in case a transaction is already
          // created and increase it by one
          AccountResult account =
              this.aeternityServiceNative.accounts.blockingGetAccount(Optional.empty());

          BaseKeyPair kp = keyPairService.generateBaseKeyPair();
          String recipient = kp.getPublicKey();
          BigInteger amount = new BigInteger("1000000000000000000");
          String payload = "payload";
          BigInteger nonce = account.getNonce().add(ONE);

          SpendTransactionModel spendTx =
              SpendTransactionModel.builder()
                  .sender(account.getPublicKey())
                  .recipient(recipient)
                  .amount(amount)
                  .payload(payload)
                  .ttl(ZERO)
                  .nonce(nonce)
                  .build();

          PostTransactionResult txResponse =
              aeternityServiceNative.transactions.blockingPostTransaction(spendTx);
          _logger.info("SpendTx hash: " + txResponse.getTxHash());
          context.assertEquals(
              txResponse.getTxHash(), aeternityServiceNative.transactions.computeTxHash(spendTx));
          try {
            waitForTxMined(txResponse.getTxHash());
          } catch (Throwable e) {
            context.fail(e);
          }
        });
  }

  @Test
  public void postSpendSignedTxString(TestContext context) {
    this.executeTest(
        context,
        t -> {
          AccountResult account =
              this.aeternityServiceNative.accounts.blockingGetAccount(Optional.empty());

          BaseKeyPair kp = keyPairService.generateBaseKeyPair();
          String recipient = kp.getPublicKey();
          BigInteger amount = new BigInteger("1000000000000000000");
          String payload = "payload";
          BigInteger nonce = account.getNonce().add(ONE);

          SpendTransactionModel spendTx =
              SpendTransactionModel.builder()
                  .sender(account.getPublicKey())
                  .recipient(recipient)
                  .amount(amount)
                  .payload(payload)
                  .ttl(ZERO)
                  .nonce(nonce)
                  .build();

          String unsignedTxNative =
              aeternityServiceNative
                  .transactions
                  .asyncCreateUnsignedTransaction(spendTx)
                  .blockingGet();

          String signedTxNative =
              aeternityServiceNative.transactions.signTransaction(
                  unsignedTxNative, baseKeyPair.getPrivateKey());

          PostTransactionResult txResponse =
              aeternityServiceNative.transactions.blockingPostTransaction(signedTxNative);

          _logger.info("SpendTx hash: " + txResponse.getTxHash());
          context.assertEquals(
              txResponse.getTxHash(), aeternityServiceNative.transactions.computeTxHash(spendTx));
          try {
            waitForTxMined(txResponse.getTxHash());
          } catch (Throwable e) {
            context.fail(e);
          }
        });
  }

  @Test
  public void postSpendSelfSignTxTestWithModel(TestContext context)
      throws CryptoException, TransactionCreateException {
    this.executeTest(
        context,
        t -> {
          try {
            BaseKeyPair recipient = keyPairService.generateBaseKeyPair();
            SpendTransactionModel spendTx =
                SpendTransactionModel.builder()
                    .sender(this.baseKeyPair.getPublicKey())
                    .recipient(recipient.getPublicKey())
                    .amount(new BigInteger("1000000000000000000"))
                    .payload("donation")
                    .ttl(ZERO)
                    .nonce(getNextBaseKeypairNonce())
                    .build();
            PostTransactionResult txResponse =
                aeternityServiceNative.transactions.blockingPostTransaction(spendTx);
            _logger.info("SpendTx hash: " + txResponse.getTxHash());
            waitForTxMined(txResponse.getTxHash());
            context.assertEquals(
                txResponse.getTxHash(), aeternityServiceNative.transactions.computeTxHash(spendTx));
          } catch (Throwable e) {
            context.fail(e);
          }
        });
  }

  @Test
  public void postSpendTxWithModelAndPK(TestContext context)
      throws CryptoException, TransactionCreateException {
    this.executeTest(
        context,
        t -> {
          try {
            BaseKeyPair recipient = keyPairService.generateBaseKeyPair();
            SpendTransactionModel spendTx =
                SpendTransactionModel.builder()
                    .sender(this.baseKeyPair.getPublicKey())
                    .recipient(recipient.getPublicKey())
                    .amount(new BigInteger("1000000000000000000"))
                    .payload("donation")
                    .ttl(ZERO)
                    .nonce(getNextBaseKeypairNonce())
                    .build();
            PostTransactionResult txResponse =
                aeternityServiceNative.transactions.blockingPostTransaction(spendTx);
            _logger.info("SpendTx hash: " + txResponse.getTxHash());
            waitForTxMined(txResponse.getTxHash());
            AccountResult recipientAccount =
                this.aeternityServiceNative.accounts.blockingGetAccount(
                    Optional.of(recipient.getPublicKey()));
            _logger.info("Account result for recipient {}", recipientAccount);
            // now send amount back
            long recipientAccountBalance = recipientAccount.getBalance().longValue();
            long recipientAccountSendAmount = 10000000l;
            spendTx =
                SpendTransactionModel.builder()
                    .sender(recipient.getPublicKey())
                    .recipient(baseKeyPair.getPublicKey())
                    .amount(BigInteger.valueOf(recipientAccountSendAmount))
                    .nonce(recipientAccount.getNonce().add(ONE))
                    .ttl(ZERO)
                    .build();
            _logger.info("Sending back {}", spendTx);
            txResponse =
                aeternityServiceNative.transactions.blockingPostTransaction(
                    spendTx, recipient.getPrivateKey());
            _logger.info("SpendTx hash: " + txResponse.getTxHash());
            waitForTxMined(txResponse.getTxHash());
            recipientAccount =
                this.aeternityServiceNative.accounts.blockingGetAccount(
                    Optional.of(recipient.getPublicKey()));
            context.assertEquals(
                recipientAccount.getBalance().longValue(),
                recipientAccountBalance
                    - recipientAccountSendAmount
                    - spendTx.getFee().longValue());
          } catch (Throwable e) {
            context.fail(e);
          }
        });
  }
}

import axios from 'axios'
import BigNumber from 'bignumber.js'
import { ICoinSubProtocol, SubProtocolType } from '../../ICoinSubProtocol'
import { IAirGapTransaction } from '../../../interfaces/IAirGapTransaction'
import * as abiDecoder from 'abi-decoder'
import {
  RawEthereumTransaction,
  UnsignedEthereumTransaction
} from '../../../serializer/unsigned-transactions/ethereum-transactions.serializer'
import { UnsignedTransaction } from '../../../serializer/unsigned-transaction.serializer'
import * as ethUtil from 'ethereumjs-util'
import { SignedEthereumTransaction } from '../../../serializer/signed-transactions/ethereum-transactions.serializer'
import { IAirGapSignedTransaction } from '../../../interfaces/IAirGapSignedTransaction'
import { BaseEthereumProtocol } from '../BaseEthereumProtocol'
const EthereumTransaction = require('ethereumjs-tx')

const AUTH_TOKEN_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  }
]

abiDecoder.addABI(AUTH_TOKEN_ABI)
export interface GenericERC20Configuration {
  symbol: string
  name: string
  marketSymbol: string
  identifier: string
  contractAddress: string
  decimals?: number
  jsonRPCAPI?: string
  infoAPI?: string
  chainId?: number
}

export class GenericERC20 extends BaseEthereumProtocol implements ICoinSubProtocol {
  tokenContract: any
  isSubProtocol = true
  subProtocolType = SubProtocolType.TOKEN

  constructor(config: GenericERC20Configuration) {
    super(config.jsonRPCAPI, config.infoAPI, config.chainId || 1) // we probably need another network here, explorer is ok

    this.tokenContract = new this.web3.eth.Contract(AUTH_TOKEN_ABI as any, config.contractAddress) // todo: check whether the auth_token_abi conversion here is okay
    this.symbol = config.symbol
    this.name = config.name
    this.marketSymbol = config.marketSymbol
    this.identifier = config.identifier
    this.decimals = config.decimals || this.decimals
  }

  async getBalanceOfPublicKey(publicKey: string): Promise<BigNumber> {
    const address = await this.getAddressFromPublicKey(publicKey)
    return this.getBalanceOfAddresses([address])
  }

  async getBalanceOfAddresses(addresses: string[]): Promise<BigNumber> {
    const balances = await Promise.all(
      addresses.map(address => {
        return this.tokenContract.methods.balanceOf(address).call()
      })
    )
    return balances.map(obj => new BigNumber(obj)).reduce((a, b) => a.plus(b))
  }

  signWithPrivateKey(privateKey: Buffer, transaction: RawEthereumTransaction): Promise<IAirGapSignedTransaction> {
    if (!transaction.data || transaction.data === '0x') {
      transaction.data = this.tokenContract.methods.transfer(transaction.to, transaction.value).encodeABI() // backwards-compatible fix
    }

    return super.signWithPrivateKey(privateKey, transaction)
  }

  private async estimateGas(recipient: string, hexValue: string, params: any): Promise<string> {
    const gasEstimate = await this.tokenContract.methods.transfer(recipient, hexValue).estimateGas(params)
    return gasEstimate.toFixed()
  }

  async prepareTransactionFromPublicKey(
    publicKey: string,
    recipients: string[],
    values: BigNumber[],
    fee: BigNumber
  ): Promise<RawEthereumTransaction> {
    if (recipients.length !== values.length) {
      throw new Error('recipients length does not match with values')
    }

    if (recipients.length !== 1) {
      throw new Error('you cannot have 0 recipients')
    }

    const balance = await this.getBalanceOfPublicKey(publicKey)

    if (balance.isGreaterThanOrEqualTo(values[0])) {
      const ethBalance = await super.getBalanceOfPublicKey(publicKey)
      const address = await this.getAddressFromPublicKey(publicKey)

      const gasAmountWeb3: string = await this.estimateGas(recipients[0], this.web3.utils.toHex(values[0].toFixed()).toString(), {
        from: address
      })

      // re-cast to our own big-number
      const gasAmount = new BigNumber(gasAmountWeb3)

      if (ethBalance.isGreaterThanOrEqualTo(fee)) {
        const txCount = await this.web3.eth.getTransactionCount(address)
        const gasPrice = fee.isEqualTo(0) ? new BigNumber(0) : fee.div(gasAmount).integerValue(BigNumber.ROUND_CEIL)
        const transaction: RawEthereumTransaction = {
          nonce: this.web3.utils.toHex(txCount),
          gasLimit: this.web3.utils.toHex(gasAmount.toFixed()),
          gasPrice: this.web3.utils.toHex(gasPrice.toFixed()),
          to: this.tokenContract.options.address,
          value: this.web3.utils.toHex(new BigNumber(0).toFixed()),
          chainId: this.chainId,
          data: this.tokenContract.methods.transfer(recipients[0], this.web3.utils.toHex(values[0].toFixed()).toString()).encodeABI()
        }
        return transaction
      } else {
        throw new Error('not enough ETH balance')
      }
    } else {
      throw new Error('not enough token balance')
    }
  }

  getTransactionsFromAddresses(addresses: string[], limit: number, offset: number): Promise<IAirGapTransaction[]> {
    const airGapTransactions: IAirGapTransaction[] = []
    return new Promise((overallResolve, overallReject) => {
      const promises: Promise<IAirGapTransaction[]>[] = []
      for (let address of addresses) {
        promises.push(
          new Promise((resolve, reject) => {
            let page = Math.ceil(offset / limit)
            axios
              .get(
                `${this.infoAPI}transactions?address=${address}&contract=${this.tokenContract.options.address}&page=${page}&limit=${limit}`
              )
              .then(response => {
                const transactionResponse = response.data
                for (const transaction of transactionResponse.docs) {
                  if (transaction.operations.length >= 1) {
                    const transactionPayload = transaction.operations[0]
                    const fee = new BigNumber(transaction.gasUsed).times(new BigNumber(transaction.gasPrice))
                    const airGapTransaction: IAirGapTransaction = {
                      hash: transaction.id,
                      from: [transactionPayload.from],
                      to: [transactionPayload.to],
                      isInbound: transactionPayload.to.toLowerCase() === address.toLowerCase(),
                      blockHeight: transaction.blockNumber,
                      protocolIdentifier: this.identifier,
                      amount: new BigNumber(transactionPayload.value),
                      fee: fee,
                      timestamp: parseInt(transaction.timeStamp, 10)
                    }

                    airGapTransactions.push(airGapTransaction)
                  }
                }

                resolve(airGapTransactions)
              })
              .catch(reject)
          })
        )
      }
      Promise.all(promises)
        .then(values => {
          overallResolve([].concat.apply([], values))
        })
        .catch(overallReject)
    })
  }

  async getTransactionDetailsFromSigned(signedTx: SignedEthereumTransaction): Promise<IAirGapTransaction> {
    const ethTx = await super.getTransactionDetailsFromSigned(signedTx)

    const extractedTx = new EthereumTransaction(signedTx.transaction)
    const tokenTransferDetails = abiDecoder.decodeMethod(`0x${extractedTx.data.toString('hex')}`)
    ethTx.to = [ethUtil.toChecksumAddress(tokenTransferDetails.params[0].value)]
    ethTx.amount = new BigNumber(tokenTransferDetails.params[1].value)

    return ethTx
  }

  async getTransactionDetails(unsignedTx: UnsignedTransaction): Promise<IAirGapTransaction> {
    const unsignedEthereumTx = unsignedTx as UnsignedEthereumTransaction
    const ethTx = await super.getTransactionDetails(unsignedEthereumTx)

    const tokenTransferDetails = abiDecoder.decodeMethod(unsignedEthereumTx.transaction.data)

    ethTx.to = [ethUtil.toChecksumAddress(tokenTransferDetails.params[0].value)]
    ethTx.amount = new BigNumber(tokenTransferDetails.params[1].value)

    return ethTx
  }
}

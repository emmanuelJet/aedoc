import { Injectable } from '@angular/core'
import { addSubProtocol, GenericERC20, GenericERC20Configuration, TezosKtProtocol } from 'airgap-coin-lib'

import { tokens } from './tokens'

interface SubProtocolInfo {
  symbol: string
  name: string
  marketSymbol: string

  identifier: string
  data: [string]
}

interface SubAccount {
  protocol: string
  subProtocols: GenericERC20Configuration[]
}

export enum ProtocolSymbols {
  AE = 'ae',
  BTC = 'btc',
  ETH = 'eth',
  XTZ = 'xtz',
  XTZ_KT = 'xtz-kt'
}

@Injectable({
  providedIn: 'root'
})
export class ProtocolsProvider {
  public subProtocols: SubAccount[] = [
    {
      protocol: 'eth',
      subProtocols: [
        {
          symbol: 'AE-ERC20',
          name: 'æternity Ethereum Token',
          marketSymbol: 'ae',
          identifier: 'eth-erc20-ae',
          contractAddress: '0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d',
          decimals: 18
        }
      ]
    }
  ]

  constructor() {
    /* */
  }

  public getEnabledSubProtocols() {
    return ['eth-erc20-ae']
  }

  public addProtocols() {
    addSubProtocol('xtz', new TezosKtProtocol())

    this.subProtocols.forEach(supportedSubAccount => {
      supportedSubAccount.subProtocols.forEach(subProtocol => {
        addSubProtocol(
          supportedSubAccount.protocol,
          new GenericERC20({
            symbol: subProtocol.symbol,
            name: subProtocol.name,
            marketSymbol: subProtocol.marketSymbol,
            identifier: subProtocol.identifier,
            contractAddress: subProtocol.contractAddress,
            decimals: subProtocol.decimals
          })
        )
      })
    })
    tokens.forEach(token => {
      addSubProtocol(
        'eth',
        new GenericERC20({
          symbol: token.symbol,
          name: token.name,
          marketSymbol: token.marketSymbol,
          identifier: token.identifier,
          contractAddress: token.contractAddress,
          decimals: token.decimals
        })
      )
    })
  }
}

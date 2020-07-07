/*
import { async, TestBed, ComponentFixture } from '@angular/core/testing'

import { IdenticonComponent } from './../identicon/identicon'
import { AddressRowComponent } from './../address-row/address-row'
import { FromToComponent } from './../from-to/from-to'
import { SignedTransactionComponent } from './signed-transaction'
import { CurrencySymbolComponent } from '../../components/currency-symbol/currency-symbol'
import { UnitHelper } from '../../../../test-config/unit-test-helper'
import { SyncProtocolUtils, EncodedType } from 'airgap-coin-lib'

fdescribe('SignedTransactionComponent', () => {
  let signedTransactionFixture: ComponentFixture<SignedTransactionComponent>
  let signedTransaction: SignedTransactionComponent

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      UnitHelper.testBed({
        declarations: [CurrencySymbolComponent, SignedTransactionComponent, FromToComponent, AddressRowComponent, IdenticonComponent]
      })
    ).compileComponents()
  }))

  beforeEach(async () => {
    signedTransactionFixture = TestBed.createComponent(SignedTransactionComponent)
    signedTransaction = signedTransactionFixture.componentInstance
  })

  it('should be created', () => {
    expect(signedTransaction instanceof SignedTransactionComponent).toBe(true)
  })

  it('should load the from-to component if a valid tx is given', async(async () => {
    const syncProtocol = new SyncProtocolUtils()
    const serializedTx = await syncProtocol.serialize({
      version: 1,
      protocol: 'eth',
      type: EncodedType.SIGNED_TRANSACTION,
      payload: {
        accountIdentifier: 'test',
        transaction:
          'f86c808504a817c800825208944a1e1d37462a422873bfccb1e705b05cc4bd922e880de0b6b3a76400008026a00678aaa8f8fd478952bf46044589f5489e809c5ae5717dfe6893490b1f98b441a06a82b82dad7c3232968ec3aa2bba32879b3ecdb877934915d7e65e095fe53d5d'
      }
    })

    expect(signedTransaction.airGapTx).toBe(undefined)
    expect(signedTransaction.fallbackActivated).toBe(false)

    const signedTx = await syncProtocol.deserialize(serializedTx)
    signedTransaction.signedTx = signedTx
    await signedTransaction.ngOnChanges()

    expect(signedTransaction.airGapTx).toBeDefined()
    expect(signedTransaction.fallbackActivated).toBe(false)
  }))

  it('should load fallback if something about the TX is wrong', async(async () => {
    const syncProtocol = new SyncProtocolUtils()
    const serializedTx = await syncProtocol.serialize({
      version: 1,
      protocol: 'eth',
      type: EncodedType.SIGNED_TRANSACTION,
      payload: {
        accountIdentifier: 'test',
        transaction:
          'asdasdasdasdsad944a1e1d37462a422873bfccb1e705b05cc4bd922e880de0b6b3a76400008026a00678aaa8f8fd478952bf46044589f5489e809c5ae5717dfe6893490b1f98b441a06a82b82dad7c3232968ec3aa2bba32879b3ecdb877934915d7e65e095fe53d5d'
      }
    })

    expect(signedTransaction.airGapTx).toBe(undefined)
    expect(signedTransaction.fallbackActivated).toBe(false)

    const signedTx = await syncProtocol.deserialize(serializedTx)
    signedTransaction.signedTx = signedTx
    await signedTransaction.ngOnChanges()

    expect(signedTransaction.airGapTx).toBeUndefined()
    expect(signedTransaction.fallbackActivated).toBe(true)
  }))
})
*/

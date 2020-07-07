import { Component, Input } from '@angular/core'

import { Transaction } from '../../models/transaction.model'

@Component({
  selector: 'from-to',
  templateUrl: 'from-to.html',
  styleUrls: ['./from-to.scss']
})
export class FromToComponent {
  @Input()
  public transaction: Transaction
}

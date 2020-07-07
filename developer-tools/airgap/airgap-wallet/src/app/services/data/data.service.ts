import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'

export enum DataServiceKey {
  WALLET = 'wallet',
  PROTOCOL = 'protocol',
  DETAIL = 'detail',
  INTERACTION = 'interaction',
  EXCHANGE = 'exchange',
  TRANSACTION = 'transaction',
  SCAN = 'scan'
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly data = []

  constructor(private readonly storage: Storage) {}

  public setData(id, data) {
    this.data[id] = data
  }

  public getData(id) {
    return this.data[id]
  }

  public async get<K extends DataServiceKey>(key: K): Promise<any> {
    return this.storage.get(key)
  }

  public async set<K extends DataServiceKey>(key: K, value: any): Promise<any> {
    return this.storage.set(key, value)
  }
}

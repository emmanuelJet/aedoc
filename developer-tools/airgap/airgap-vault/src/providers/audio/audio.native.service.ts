import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { Entropy, IEntropyGenerator } from '../entropy/IEntropyGenerator'
import { Observable } from 'rxjs'

declare var window: any

import workerJS from '../../assets/workers/entropyCalculatorWorker'
import { PermissionsProvider, PermissionStatus } from '../permissions/permissions'
const blobURL = window.URL.createObjectURL(new Blob([workerJS]))
const entropyCalculatorWorker = new Worker(blobURL)

@Injectable()
export class AudioNativeService implements IEntropyGenerator {
  private ENTROPY_SIZE = 4096

  private collectedEntropyPercentage: number = 0

  private handler
  private entropyObservable: Observable<Entropy>

  constructor(private platform: Platform, private permissionsProvider: PermissionsProvider) {
    this.entropyObservable = Observable.create(observer => {
      entropyCalculatorWorker.onmessage = event => {
        this.collectedEntropyPercentage += event.data.entropyMeasure
        observer.next({
          entropyHex: event.data.entropyHex
        })
      }
      this.handler = audioStream => {
        const buffer1 = this.arrayBufferFromIntArray(audioStream.data)
        entropyCalculatorWorker.postMessage(
          {
            entropyBuffer: buffer1
          },
          [buffer1]
        )
      }
    })
  }

  async start(): Promise<void> {
    this.collectedEntropyPercentage = 0
    await this.platform.ready()

    const permissionStatus = await this.permissionsProvider.hasMicrophonePermission()
    if (permissionStatus !== PermissionStatus.GRANTED) {
      return
    }

    window.audioinput.start({
      bufferSize: this.ENTROPY_SIZE
    })

    setTimeout(() => {
      window.addEventListener('audioinput', this.handler)
    }, 1000)

    console.log('audioinput created.')
  }

  stop(): Promise<void> {
    return new Promise(resolve => {
      console.log('removed audioinput listener')
      window.audioinput.stop()
      window.removeEventListener('audioinput', this.handler)
      resolve()
    })
  }

  getEntropyUpdateObservable(): Observable<Entropy> {
    return this.entropyObservable
  }

  private arrayBufferFromIntArray(array: number[]) {
    const buffer = new ArrayBuffer(array.length * 2)
    const bufView = new Uint8Array(buffer)

    for (let i = 0; i < array.length; i++) {
      bufView[i] = Math.abs(array[i] * 10000)
    }

    return buffer
  }

  getCollectedEntropyPercentage(): number {
    return this.collectedEntropyPercentage / 200
  }
}

import { sha3_256 } from 'js-sha3'
import bip39 from 'bip39'
import secretJS from 'secrets.js-grempe'

export class BIP39Signer {
  readonly checkSumLength = 10

  private getOffsetMapping(share: string): any {
    const shareWordCount = share.split(' ').length
    if (shareWordCount === 48) {
      return { offset: 99, seedOffset: 64 }
    } else if (shareWordCount === 36) {
      return { offset: 67, seedOffset: 42 }
    } else if (shareWordCount === 24) {
      return { offset: 67, seedOffset: 32 }
    }
    throw new Error('Currently only recovery of secrets with 24, 18 or 12 words are supported')
  }

  private getRandomIntInclusive(min: number, max: number): number {
    const randomBuffer = new Uint32Array(1)
    window.crypto.getRandomValues(randomBuffer)
    let randomNumber = randomBuffer[0] / (0xffffffff + 1)
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(randomNumber * (max - min + 1)) + min
  }

  entropyToMnemonic(entropy: string): string {
    return bip39.entropyToMnemonic(entropy)
  }

  mnemonicToEntropy(mnemonic: string): string {
    const usedList = BIP39Signer.determineWordList(mnemonic)

    if (!usedList) {
      throw Error('non-compatible mnemonic')
    }

    return bip39.mnemonicToEntropy(mnemonic, usedList)
  }

  static prepareMnemonic(mnemonic: string): string {
    return mnemonic.trim().toLowerCase()
  }

  static validateMnemonic(mnemonic: string): boolean {
    const preparedMnemonic = BIP39Signer.prepareMnemonic(mnemonic)
    const wordList = BIP39Signer.determineWordList(preparedMnemonic)
    return bip39.validateMnemonic(preparedMnemonic, wordList)
  }

  static determineWordList(mnemonic: string): any[] {
    for (const list of BIP39Signer.wordLists()) {
      if (bip39.validateMnemonic(BIP39Signer.prepareMnemonic(mnemonic), list)) {
        return list
      }
    }
  }

  static wordLists(): any[] {
    return [
      bip39.wordlists.english
      /*
      bip39.wordlists.chinese_simplified,
      bip39.wordlists.chinese_traditional,
      bip39.wordlists.french,
      bip39.wordlists.italian,
      bip39.wordlists.japanese,
      bip39.wordlists.korean,
      bip39.wordlists.spanish
      */
    ]
  }

  generateSocialRecover(secret: string, numberOfShares: number, threshold: number): string[] {
    if (threshold > numberOfShares) {
      throw new Error('The threshold needs to be smaller or equal to the number or shares')
    } else if (numberOfShares < 2) {
      throw new Error('At least two shares are needed')
    }
    const secretDigester = sha3_256.create()

    // TODO check if mnemoinc or secret
    const seed: string = bip39.mnemonicToEntropy(secret)
    secretDigester.update(seed)

    const shares = secretJS.share(seed + secretDigester.hex().slice(0, this.checkSumLength), numberOfShares, threshold)
    const calculatedShares = []
    for (let i = 0; i < shares.length; i++) {
      let paddedShare = shares[i].concat(
        Array(29)
          .fill(0)
          .map(() => this.getRandomIntInclusive(0, 9))
          .join('')
      )
      calculatedShares[i] = `${bip39.entropyToMnemonic(paddedShare.slice(0, 64))} ${bip39.entropyToMnemonic(paddedShare.slice(64, 128))}`
    }
    return calculatedShares
  }

  recoverKey(shares: any): string {
    const offset = this.getOffsetMapping(shares[0])
    let translatedShares = []
    for (let i = 0; i < shares.length; i++) {
      let words = shares[i].split(' ')
      let firstHalf = words.slice(0, 24)
      let secondHalf = words.slice(24, words.length)
      translatedShares[i] = `${bip39.mnemonicToEntropy(firstHalf.join(' '))}${bip39.mnemonicToEntropy(secondHalf.join(' '))}`.substr(
        0,
        offset.offset
      )
    }
    const secretDigester = sha3_256.create()
    const combine = secretJS.combine(translatedShares)
    const seed = combine.slice(0, -this.checkSumLength)

    secretDigester.update(seed)

    let checksum = secretDigester.hex().slice(0, this.checkSumLength)
    let checksum2 = combine.substr(-this.checkSumLength)
    if (checksum !== checksum2) {
      throw new Error(
        'Checksum error, either the passed shares were generated for different secrets or the amount of shares is below the threshold'
      )
    }
    return bip39.entropyToMnemonic(seed)
  }
}

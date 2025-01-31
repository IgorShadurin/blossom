import { isStorageSession } from '../messaging/message.asserts'
import { Address } from '../model/general.types'
import { Network } from '../model/storage/network.model'
import { MemorySession, KeyData, StorageSession } from '../model/storage/session.model'
import {
  bytesToWordArray,
  decrypt,
  encrypt,
  hexToWordArray,
  wordArrayToBytes,
  wordArrayToHex,
} from '../utils/encryption'
import { removeWarningBadge, setWarningBadge } from '../utils/extension'
import { generateRandomString } from '../utils/random'
import { Storage } from './storage/storage.service'

export class SessionService {
  private storage: Storage = new Storage()

  public async open(
    ensUserName: string,
    localUserName: string,
    address: Address,
    network: Network,
    seed: Uint8Array,
  ): Promise<void> {
    const key = await this.encryptSeed(seed)

    removeWarningBadge()

    return this.storage.setSession({
      ensUserName,
      localUserName,
      network,
      address,
      key,
    })
  }

  public async load(): Promise<MemorySession> {
    const rawSession = await this.storage.getSession()

    const session = await this.processSession(rawSession)

    if (!session) {
      throw new Error('User is not logged in')
    }

    return session
  }

  public close(): Promise<void> {
    setWarningBadge()

    return this.storage.deleteSession()
  }

  public onChange(listener: (session: MemorySession) => void) {
    this.storage.onSessionChange(async (session: StorageSession) =>
      listener(await this.processSession(session)),
    )
  }

  private async processSession(session: StorageSession): Promise<MemorySession> {
    if (!session) {
      setWarningBadge()

      return null
    }

    if (!isStorageSession(session)) {
      this.storage.deleteSession()
      setWarningBadge()

      return null
    }

    const memorySession: MemorySession = session as unknown as MemorySession

    memorySession.key.seed = await this.decryptSeed(session)

    if (!session.key.seed) {
      this.storage.deleteSession()
      setWarningBadge()

      return null
    }

    removeWarningBadge()

    return memorySession
  }

  private async encryptSeed(seed: Uint8Array): Promise<KeyData<string>> {
    const sessionKey = generateRandomString(128)
    const url = this.generateRandomUrl()

    const encryptedSeed = wordArrayToHex(encrypt(sessionKey, bytesToWordArray(seed)))

    await chrome.cookies.set({
      url,
      name: generateRandomString(10),
      value: sessionKey,
      secure: true,
    })

    return {
      seed: encryptedSeed,
      url,
    }
  }

  private async decryptSeed(session: StorageSession): Promise<Uint8Array> {
    const {
      key: { seed: encryptedSeed, url },
    } = session || { key: {} }

    if (!encryptedSeed || !url || typeof encryptedSeed !== 'string') {
      return
    }

    const [cookie] = await chrome.cookies.getAll({
      url,
    })

    const { value: sessionKey } = cookie || {}

    if (!sessionKey) {
      this.storage.deleteSession()

      return
    }

    return wordArrayToBytes(decrypt(sessionKey, hexToWordArray(encryptedSeed)))
  }

  private generateRandomUrl(): string {
    return `https://www.${generateRandomString(50)}.com`
  }
}

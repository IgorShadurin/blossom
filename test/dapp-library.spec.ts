import { Wallet } from 'ethers'
import { mnemonicToSeed } from 'ethers/lib/utils'
import { Page } from 'puppeteer'
import { hexToBytes } from '../src/utils/encryption'
import { getWalletByIndex } from '../src/utils/ethers'
import { BEE_URL } from './config/constants'
import { login, logout, registerExisting } from './test-utils/account'
import { removeZeroFromHex } from './test-utils/ethers'
import { click, getPageByTitle, openPage, wait, waitForElementText } from './test-utils/page'

const FDP_STORAGE_PAGE_URL = `${BEE_URL}/bzz/${global.FDP_STORAGE_PAGE_REFERENCE}/`

describe('Dapp interaction with Blossom, using the library', () => {
  let page: Page
  const username = 'fdpuser'
  const password = 'pass12345'
  const mnemonic = 'screen series sponsor unfair wear measure idle strike flame zone gain process'

  beforeAll(async () => {
    await registerExisting(username, password, mnemonic)
    await login(username, password)
    page = await openPage(FDP_STORAGE_PAGE_URL)
  })

  afterAll(async () => {
    await page.close()
    await logout()
  })

  describe('fdp-storage tests', () => {
    test('Should successfully create a pod', async () => {
      await click(page, 'create-pod-btn')

      await wait(5000)

      const blossomPage = await getPageByTitle('Blossom')

      if (blossomPage) {
        await click(blossomPage, 'dialog-confirm-btn')
      }

      expect(await waitForElementText(page, '#create-pod[complete="true"]')).toEqual('success')
    })

    test('Pod should be created', async () => {
      await click(page, 'check-pod-btn')

      expect(await waitForElementText(page, '#pod-created[complete="true"]')).toEqual('true')
    })

    test('Should successfully create a directory', async () => {
      await click(page, 'create-directory-btn')

      expect(await waitForElementText(page, '#create-directory[complete="true"]')).toEqual('success')
    })

    test('Should successfully upload file', async () => {
      await click(page, 'upload-file-btn')

      expect(await waitForElementText(page, '#upload-file[complete="true"]')).toEqual('success')
    })

    test('Should successfully download file', async () => {
      await click(page, 'download-file-btn')

      expect(await waitForElementText(page, '#download-file[complete="true"]')).toEqual('Blossom')
    })

    test("Shouldn't create a random pod", async () => {
      await click(page, 'random-pod-create-btn')

      await wait(5000)

      const blossomPage = await getPageByTitle('Blossom')

      if (blossomPage) {
        await click(blossomPage, 'dialog-cancel-btn')
      }

      expect(await waitForElementText(page, '#random-pod-create[complete="true"]')).toEqual('failed')
    })

    test('Should get full access of personal storage', async () => {
      await click(page, 'request-full-access-btn')

      await wait(5000)

      const blossomPage = await getPageByTitle('Blossom')

      if (blossomPage) {
        await click(blossomPage, 'dialog-confirm-btn')
      }

      expect(await waitForElementText(page, '#full-access[complete="true"]')).toEqual('true')

      await click(page, 'random-pod-create-btn-2')

      expect(await waitForElementText(page, '#random-pod-create-2[complete="true"]')).toEqual('success')
    })
  })

  describe('Signer tests', () => {
    test('Should sign a message', async () => {
      await click(page, 'sign-message-btn')

      await wait(5000)

      const blossomPage = await getPageByTitle('Blossom')

      await click(blossomPage, 'dialog-confirm-btn')

      const podWallet = getWalletByIndex(hexToBytes(removeZeroFromHex(mnemonicToSeed(mnemonic))), 1)

      const wallet = new Wallet(podWallet.privateKey)

      const hash = await wallet.signMessage('Blossom')

      expect(await waitForElementText(page, '#sign-message[complete="true"]')).toEqual(hash)
    })
  })
})

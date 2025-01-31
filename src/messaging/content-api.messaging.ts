import { BigNumber } from 'ethers'
import BackgroundAction from '../constants/background-actions.enum'
import { Address, DappId } from '../model/general.types'
import {
  AccountResponse,
  ImportAccountData,
  LocalLoginData,
  LoginData,
  NetworkEditData,
  RegisterData,
  RegisterResponse,
  UsernameCheckData,
  UserResponse,
} from '../model/internal-messages.model'
import { Dapp } from '../model/storage/dapps.model'
import { Network } from '../model/storage/network.model'
import { Swarm } from '../model/storage/swarm.model'
import { LocaleData } from '../services/locales.service'
import { sendMessage } from './scripts.messaging'

export function login(data: LoginData): Promise<void> {
  return sendMessage<LoginData, void>(BackgroundAction.LOGIN, data)
}

export function localLogin(data: LocalLoginData): Promise<void> {
  return sendMessage<LocalLoginData, void>(BackgroundAction.LOCAL_LOGIN, data)
}

export function importAccount(data: ImportAccountData): Promise<void> {
  return sendMessage<ImportAccountData, void>(BackgroundAction.IMPORT_ACCOUNT, data)
}

export function register(data: RegisterData): Promise<RegisterResponse> {
  return sendMessage<RegisterData, RegisterResponse>(BackgroundAction.REGISTER, data)
}

export function logout(): Promise<void> {
  return sendMessage<void, void>(BackgroundAction.LOGOUT)
}

export function isUsernameAvailable(data: UsernameCheckData): Promise<boolean> {
  return sendMessage<UsernameCheckData, boolean>(BackgroundAction.CHECK_USERNAME, data)
}

export function generateWallet(): Promise<RegisterResponse> {
  return sendMessage<void, RegisterResponse>(BackgroundAction.GENERATE_WALLET)
}

export function openAuthPage(): Promise<void> {
  return sendMessage<void, void>(BackgroundAction.OPEN_AUTH_PAGE)
}

export function getCurrentUser(): Promise<UserResponse> {
  return sendMessage<void, UserResponse>(BackgroundAction.GET_CURRENT_USER)
}

export function getLocalAccounts(): Promise<AccountResponse[]> {
  return sendMessage<void, AccountResponse[]>(BackgroundAction.GET_LOCAL_ACCOUNTS)
}

export function getLocales(): Promise<LocaleData> {
  return sendMessage<void, LocaleData>(BackgroundAction.GET_LOCALES)
}

export async function getAccountBalance(address: Address): Promise<BigNumber> {
  const { hex } = await sendMessage<Address, { hex: string }>(BackgroundAction.GET_BALANCE, address)

  return BigNumber.from(hex)
}

export function getSelectedNetwork(): Promise<Network> {
  return sendMessage<void, Network>(BackgroundAction.SETTINGS_GET_SELECTED_NETWORK)
}

export function getNetworkList(): Promise<Network[]> {
  return sendMessage<void, Network[]>(BackgroundAction.SETTINGS_GET_NETWORK_LIST)
}

export function addNetwork(network: Network): Promise<void> {
  return sendMessage<Network, void>(BackgroundAction.SETTINGS_ADD_NETWORK, network)
}

export function editNetwork(label: string, network: Network): Promise<void> {
  return sendMessage<NetworkEditData, void>(BackgroundAction.SETTINGS_EDIT_NETWORK, { label, network })
}

export function deleteNetwork(network: Network): Promise<void> {
  return sendMessage<Network, void>(BackgroundAction.SETTINGS_DELETE_NETWORK, network)
}

export function getSwarmSettings(): Promise<Swarm> {
  return sendMessage<void, Swarm>(BackgroundAction.SETTINGS_GET_SWARM)
}

export function setSwarmSettings(swarm: Swarm): Promise<void> {
  return sendMessage<Swarm, void>(BackgroundAction.SETTINGS_SET_SWARM, swarm)
}

export function getAllDappIds(): Promise<DappId[]> {
  return sendMessage<void, DappId[]>(BackgroundAction.GET_ALL_DAPP_IDS)
}

export function getDappSettings(dappId: DappId): Promise<Dapp> {
  return sendMessage<DappId, Dapp>(BackgroundAction.GET_DAPP_SETTINGS, dappId)
}

export function updateDappSettings(dapp: Dapp): Promise<void> {
  return sendMessage<Dapp, void>(BackgroundAction.UPDATE_DAPP_SETTINGS, dapp)
}

export function echo<Data>(data: Data): Promise<Data> {
  return sendMessage<Data, Data>(BackgroundAction.ECHO, data)
}

import { BytesMessage } from '../model/serialized-message-data'

export function isUint8Array(data: unknown): data is Uint8Array {
  return ArrayBuffer.isView(data)
}

export function isSerializedUint8Array(data: unknown): data is BytesMessage {
  const { type, value } = (data || {}) as BytesMessage

  return type === 'bytes' && typeof value === 'string'
}

export function uint8ArrayToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

export function stringToUint8Array(serializedBytes: string): Uint8Array {
  return new TextEncoder().encode(serializedBytes)
}

export function uint8ArrayToSerializedParameter(bytes: Uint8Array): BytesMessage {
  return {
    type: 'bytes',
    value: uint8ArrayToString(bytes),
  }
}

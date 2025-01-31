import { ApiActions } from './constants/api-actions.enum'
import { BlossomMessages } from './messages/blossom-messages'

export class Signer {
  constructor(private messages: BlossomMessages) {}

  public signMessage(podName: string, message: string): Promise<string> {
    return this.messages.sendMessage(`${ApiActions.SIGNER_SIGN_MESSAGE}`, { podName, message })
  }
}

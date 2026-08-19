import { applyInlineStyles, type Dispose, waitForElement } from '../dom'
import { themeConfig } from '../theme/config'

/** Applies the chat-scroll test background. */
export function applyChatArea(): Dispose {
  return waitForElement<HTMLElement>('[data-conversation-scroll]', (chat) => {
    console.log('🔥 chat area found', chat)
    return applyInlineStyles(chat, themeConfig.chatArea)
  })
}

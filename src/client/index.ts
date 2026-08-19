import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import { applyChatArea } from './components/chatArea'
import { applyHeroTitle } from './components/heroTitle'
import { applyInputArea } from './components/inputArea'
import { applyInputCard } from './components/inputCard'
import { applyMessage } from './components/message'
import { applyMiddleArea } from './components/middleArea'
import { applySideBar } from './components/sideBar'
import type { Dispose } from './dom'
import { themeConfig } from './theme/config'

export const inject = ['theme']

/** Registers every wallpaper surface for the client plugin lifetime. */
export function apply(ctx: ClientContext): void {
  console.log('🔥 Luvian theme loaded, nuonuo')

  ctx.effect(() => {
    const disposers: Dispose[] = [
      ctx.theme.overrideTokens('@luvian/dsh-ui-wallpaper', themeConfig.tokenOverrides),
      applyChatArea(),
      applyHeroTitle(),
      applyMiddleArea(),
      applyInputArea(),
      applyInputCard(),
      applySideBar(),
      applyMessage(),
    ]

    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  }, 'ui-wallpaper: visual surfaces')
}

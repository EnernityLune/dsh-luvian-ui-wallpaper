import { applyInlineStyles, type Dispose, waitForElement } from '../dom'
import { themeConfig } from '../theme/config'

/** Makes the composer seat transparent. */
export function applyInputArea(): Dispose {
  return waitForElement<HTMLElement>('[data-composer-seat]', (area) => {
    console.log('🔥 input area found', area)
    return applyInlineStyles(area, themeConfig.inputArea)
  })
}

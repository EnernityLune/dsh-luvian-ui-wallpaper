import { applyInlineStyles, type Dispose, waitForElement } from '../dom'
import { themeConfig } from '../theme/config'

/** Applies the composer card test treatment. */
export function applyInputCard(): Dispose {
  return waitForElement<HTMLElement>('[data-composer-card="true"]', (card) => {
    console.log('🔥 input card found', card)
    const phaseRoot = card.closest<HTMLElement>('[data-phase]')
    let styleCleanup: Dispose | undefined

    const syncPhase = (): void => {
      styleCleanup?.()
      const hero = phaseRoot?.dataset.phase === 'hero'
      const visual = hero ? themeConfig.inputCard.hero : themeConfig.inputCard
      styleCleanup = applyInlineStyles(card, {
        background: visual.background,
        'background-position': themeConfig.inputCard['background-position'],
        'background-repeat': themeConfig.inputCard['background-repeat'],
        'background-size': themeConfig.inputCard['background-size'],
        opacity: visual.opacity,
        'border-radius': themeConfig.inputCard.borderRadius,
        border: themeConfig.inputCard.border,
        'backdrop-filter': `blur(${visual.blur})`,
        '-webkit-backdrop-filter': `blur(${visual.blur})`,
      })
    }

    syncPhase()
    const phaseObserver = new MutationObserver(syncPhase)
    if (phaseRoot !== null) {
      phaseObserver.observe(phaseRoot, { attributes: true, attributeFilter: ['data-phase'] })
    }

    return () => {
      phaseObserver.disconnect()
      styleCleanup?.()
    }
  })
}

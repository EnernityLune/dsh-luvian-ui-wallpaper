import { applyInlineStyles, type Dispose, waitForElement } from '../dom'
import { themeConfig } from '../theme/config'

/** Replaces the blank-session Hero fish and headline while retaining its preview badge. */
export function applyHeroTitle(): Dispose {
  return waitForElement<SVGElement>(
    '[data-phase="hero"] svg[viewBox="0 0 23.16 17.04"][width="34"]',
    (fish) => {
      const fishHitbox = fish.parentElement
      const headline = fishHitbox?.parentElement
      const headlineText = fishHitbox?.nextElementSibling as HTMLElement | null
      const previewBadge = headlineText?.nextElementSibling as HTMLElement | null
      if (fishHitbox == null || headline == null || headlineText == null || previewBadge == null) return

      const logo = document.createElement('img')
      logo.src = themeConfig.hero.titleLogo.source
      logo.alt = '弗糯糯'
      logo.draggable = false
      logo.dataset.luvianHeroTitle = 'true'
      logo.style.width = themeConfig.hero.titleLogo.width
      logo.style.height = themeConfig.hero.titleLogo.height
      logo.style.objectFit = 'contain'
      logo.style.flex = 'none'

      const cleanups: Dispose[] = [
        applyInlineStyles(headline, {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          gap: '10px',
        }),
        applyInlineStyles(fishHitbox, { display: 'none' }),
        applyInlineStyles(headlineText, { display: 'none' }),
      ]
      previewBadge.insertAdjacentElement('beforebegin', logo)

      return () => {
        logo.remove()
        for (const cleanup of cleanups.reverse()) cleanup()
      }
    },
  )
}

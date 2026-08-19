import { applyInlineStyles, type Dispose, waitForElement } from '../dom'
import { themeConfig } from '../theme/config'
import { assetUrls } from '../theme/generated'

function createVideoBackground(source: string | null): HTMLVideoElement | null {
  if (!source) return null
  const video = document.createElement('video')
  video.src = source
  video.autoplay = true
  video.muted = true
  video.defaultMuted = true
  video.loop = true
  video.playsInline = true
  video.preload = 'auto'
  video.controls = false
  video.disablePictureInPicture = true
  video.dataset.luvianBackground = 'middle-area'
  video.setAttribute('aria-hidden', 'true')

  const styles = themeConfig.middleArea.video
  Object.assign(video.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '-1',
    pointerEvents: 'none',
    opacity: styles.opacity,
    objectFit: styles['object-fit'],
    objectPosition: styles['object-position'],
  })

  return video
}

function mountVideoBackground(root: HTMLElement, video: HTMLVideoElement | null): Dispose {
  if (video === null) return () => {}
  root.prepend(video)
  void video.play().catch(() => {})

  return () => {
    if (video.parentElement === root) video.remove()
  }
}

/** Applies a static background and an optional video wallpaper to the middle column. */
export function applyMiddleArea(): Dispose {
  const video = createVideoBackground(assetUrls.wallpaper)
  const disposeBinding = waitForElement<HTMLElement>(
    '[data-slot="conversation"] > [data-phase]',
    (root) => {
      console.log('🔥 middle area found', root)
      const styles = themeConfig.middleArea
      const cleanups: Dispose[] = [
        applyInlineStyles(root, {
          background: styles.background,
          'background-position': styles['background-position'],
          'background-repeat': styles['background-repeat'],
          'background-size': styles['background-size'],
          position: 'relative',
          isolation: 'isolate',
        }),
        mountVideoBackground(root, video),
      ]

      return () => {
        for (const cleanup of cleanups.reverse()) cleanup()
      }
    },
  )

  return () => {
    disposeBinding()
    if (video === null) return
    video.pause()
    video.removeAttribute('src')
    video.load()
    video.remove()
  }
}

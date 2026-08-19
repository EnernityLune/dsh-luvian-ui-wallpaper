export type Dispose = () => void

export type InlineStyles = Readonly<Record<string, string>>

/** Keeps one matching element bound, rebinding when React replaces it. */
export function waitForElement<T extends Element>(
  selector: string,
  onFound: (element: T) => void | Dispose,
  root: ParentNode & Node = document,
): Dispose {
  let disposed = false
  let current: T | null = null
  let currentCleanup: Dispose | undefined
  let scheduled = false

  const sync = (): void => {
    scheduled = false
    if (disposed) return

    const element = root.querySelector<T>(selector)
    if (element === current) return

    currentCleanup?.()
    currentCleanup = undefined
    current = element
    if (element !== null) currentCleanup = onFound(element) ?? undefined
  }

  const scheduleSync = (): void => {
    if (disposed || scheduled) return
    scheduled = true
    queueMicrotask(sync)
  }

  const observer = new MutationObserver(scheduleSync)
  const observationRoot = root instanceof Document ? root.documentElement : root
  observer.observe(observationRoot, { childList: true, subtree: true })
  sync()

  return () => {
    if (disposed) return
    disposed = true
    observer.disconnect()
    currentCleanup?.()
    currentCleanup = undefined
    current = null
  }
}

/** Applies inline styles and restores only the properties changed here. */
export function applyInlineStyles(element: HTMLElement, styles: InlineStyles): Dispose {
  const previous = Object.entries(styles).map(([property]) => ({
    property,
    priority: element.style.getPropertyPriority(property),
    value: element.style.getPropertyValue(property),
  }))

  for (const [property, value] of Object.entries(styles)) {
    element.style.setProperty(property, value)
  }

  return () => {
    for (const { property, priority, value } of previous) {
      if (value === '') element.style.removeProperty(property)
      else element.style.setProperty(property, value, priority)
    }
  }
}

/** Replaces one SVG visually while keeping the original React node available for cleanup. */
export function replaceSvgWithImage(
  svg: SVGElement,
  source: string,
  size: Readonly<{ width: string; height: string }>,
  role: string,
): Dispose {
  const previousDisplay = svg.style.display
  const image = document.createElement('img')
  image.src = source
  image.alt = ''
  image.draggable = false
  image.dataset.luvianIcon = role
  image.setAttribute('aria-hidden', 'true')
  image.style.width = size.width
  image.style.height = size.height
  image.style.objectFit = 'contain'
  image.style.flex = 'none'

  svg.style.display = 'none'
  svg.insertAdjacentElement('afterend', image)

  return () => {
    image.remove()
    svg.style.display = previousDisplay
  }
}

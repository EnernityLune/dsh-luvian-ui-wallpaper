import {
  applyInlineStyles,
  type Dispose,
  replaceSvgWithImage,
  waitForElement,
} from '../dom'
import { themeConfig } from '../theme/config'

type IconConfig = Readonly<{ source: string; width: string; height: string }>
type ResponsiveIconConfig = IconConfig & Readonly<{
  railSource?: string
  railWidth: string
  railHeight: string
}>

const PANEL_ICON_PATH = 'M9.67272 0.522841'
const SEARCH_ICON_PATH = 'M11.894845 6.647401'
const FILTER_ICON_PATH = 'M10.3232 9.18164'
const ADD_WORKSPACE_ICON_PATH = 'M3.55246 0L3.55246 2.44252'
const SETTINGS_ICON_PATH_16 = 'M14.0861 5.51366'
const SETTINGS_ICON_PATH_14 = 'M12.1192 4.91016'

// 侧栏按钮的语义标识（en + zh）。主定位用此列表，跨 locale 与图标几何都稳定；
// 找不到时再回退到下方 SVG 几何路径匹配（仅作最后兜底）。
const ICON_LABELS: Record<'collapse' | 'search' | 'filter' | 'addWorkspace', readonly string[]> = {
  collapse: ['Collapse sidebar', '收起侧边栏', 'Open sidebar', '打开侧边栏'],
  search: ['Search sessions', '搜索会话'],
  filter: ['View options', '视图选项'],
  addWorkspace: ['Add workspace', '添加工作区'],
}

function findButtonByAriaLabel(root: ParentNode, labels: readonly string[]): HTMLElement | null {
  for (const button of root.querySelectorAll<HTMLElement>('button')) {
    const label = button.getAttribute('aria-label')
    if (label !== null && labels.includes(label)) return button
  }
  return null
}

function findBrandButton(header: HTMLElement, newSession: HTMLElement | null): HTMLElement | null {
  const label = newSession?.getAttribute('aria-label')
  if (label === null || label === undefined) return null

  return Array.from(header.querySelectorAll<HTMLElement>(':scope > button'))
    .find(button => button.getAttribute('aria-label') === label) ?? null
}

function applyIcon(
  container: HTMLElement | null,
  config: IconConfig,
  role: string,
  cleanups: Dispose[],
): void {
  if (container === null || config.source === '') return
  if (container.querySelector(`:scope > img[data-luvian-icon="${role}"]`) !== null) return

  const svg = container.querySelector<SVGElement>(':scope > svg')
  if (svg === null) return
  cleanups.push(replaceSvgWithImage(svg, config.source, config, role))
}

function findButtonByIconPath(root: HTMLElement, pathStart: string): HTMLElement | null {
  const path = Array.from(root.querySelectorAll<SVGPathElement>('svg path[d]'))
    .find(candidate => candidate.getAttribute('d')?.startsWith(pathStart) === true)
  return path?.closest<HTMLElement>('button') ?? null
}

function applyResponsiveButtonIcon(
  button: HTMLElement | null,
  config: ResponsiveIconConfig,
  role: string,
  cleanups: Dispose[],
  isRail: (button: HTMLElement) => boolean = candidate => candidate.getBoundingClientRect().width >= 34,
): void {
  if (button === null || config.source === '') return
  if (button.querySelector(`:scope > img[data-luvian-icon="${role}"]`) !== null) return

  const previousDisplays = new Map<SVGElement, string>()
  const image = document.createElement('img')
  image.src = config.source
  image.alt = ''
  image.draggable = false
  image.dataset.luvianIcon = role
  image.setAttribute('aria-hidden', 'true')
  image.style.objectFit = 'contain'
  image.style.flex = 'none'

  const syncOriginals = (): void => {
    for (const svg of button.querySelectorAll<SVGElement>(':scope > svg')) {
      if (!previousDisplays.has(svg)) previousDisplays.set(svg, svg.style.display)
      svg.style.display = 'none'
    }
  }
  const syncSize = (): void => {
    const rail = isRail(button)
    image.src = rail && config.railSource !== undefined ? config.railSource : config.source
    image.style.width = rail ? config.railWidth : config.width
    image.style.height = rail ? config.railHeight : config.height
  }

  syncOriginals()
  const insertionPoint = Array.from(button.children)
    .find(child => child.tagName.toLowerCase() !== 'svg')
  button.insertBefore(image, insertionPoint ?? null)
  syncSize()

  const mutationObserver = new MutationObserver(() => {
    syncOriginals()
    syncSize()
  })
  mutationObserver.observe(button, { childList: true })
  const resizeObserver = new ResizeObserver(syncSize)
  resizeObserver.observe(button)

  cleanups.push(() => {
    mutationObserver.disconnect()
    resizeObserver.disconnect()
    image.remove()
    for (const [svg, display] of previousDisplays) svg.style.display = display
  })
}

function hideButtonSvgs(
  button: HTMLElement | null,
  role: string,
  cleanups: Dispose[],
): void {
  if (button === null || button.dataset.luvianHiddenIcon === role) return

  button.dataset.luvianHiddenIcon = role
  const previousDisplays = new Map<SVGElement, string>()
  const sync = (): void => {
    for (const svg of button.querySelectorAll<SVGElement>(':scope > svg')) {
      if (!previousDisplays.has(svg)) previousDisplays.set(svg, svg.style.display)
      svg.style.display = 'none'
    }
  }

  sync()
  const observer = new MutationObserver(sync)
  observer.observe(button, { childList: true })
  cleanups.push(() => {
    observer.disconnect()
    delete button.dataset.luvianHiddenIcon
    for (const [svg, display] of previousDisplays) svg.style.display = display
  })
}

/** Applies one sidebar background and optional custom button icons. */
export function applySideBar(): Dispose {
  return waitForElement<HTMLElement>('[data-slot="sidebar"]', (sidebarSlot) => {
    const root = sidebarSlot.firstElementChild as HTMLElement | null
    if (root === null) return

    const header = root.firstElementChild as HTMLElement | null
    const newSession = root.querySelector<HTMLElement>(':scope > button')
    const workspaceSlot = root.querySelector<HTMLElement>('[data-slot="sidebar.workspaces"]')
    const workspace = workspaceSlot?.parentElement ?? null
    const footer = root.lastElementChild as HTMLElement | null

    const cleanups: Dispose[] = []
    cleanups.push(applyInlineStyles(root, themeConfig.sideBar.root))
    if (header !== null) cleanups.push(applyInlineStyles(header, themeConfig.sideBar.header))
    if (newSession !== null) cleanups.push(applyInlineStyles(newSession, themeConfig.sideBar.newSession))
    if (workspace !== null) cleanups.push(applyInlineStyles(workspace, themeConfig.sideBar.workspace))
    if (footer !== null) cleanups.push(applyInlineStyles(footer, themeConfig.sideBar.footer))

    const iconCleanups: Dispose[] = []
    const syncIcons = (): void => {
      const liveNewSession = root.querySelector<HTMLElement>(':scope > button')
      const liveHeader = root.firstElementChild as HTMLElement | null
      const brand = liveHeader === null ? null : findBrandButton(liveHeader, liveNewSession)
      applyIcon(brand, themeConfig.sideBar.icons.brand, 'brand', iconCleanups)
      hideButtonSvgs(liveNewSession, 'new-session', iconCleanups)

      // 稳定容器定位（data-slot 不随 locale / 图标几何变化）
      const settingsSlot = root.querySelector<HTMLElement>('[data-slot="sidebar.settings"]')
      const wsSlot = root.querySelector<HTMLElement>('[data-slot="sidebar.workspaces"]')
      const scope = wsSlot ?? root

      // 设置：优先用稳定容器内的唯一 button，找不到再回退几何
      applyResponsiveButtonIcon(
        settingsSlot?.querySelector<HTMLElement>(':scope > button')
          ?? findButtonByIconPath(root, SETTINGS_ICON_PATH_16)
          ?? findButtonByIconPath(root, SETTINGS_ICON_PATH_14),
        themeConfig.sideBar.icons.settings,
        'settings',
        iconCleanups,
        button => button.querySelector(':scope > span') === null,
      )
      // 搜索 / 筛选 / 添加：在 workspaces 容器内按中英双语文案匹配，回退几何
      applyResponsiveButtonIcon(
        findButtonByAriaLabel(scope, ICON_LABELS.search) ?? findButtonByIconPath(scope, SEARCH_ICON_PATH),
        themeConfig.sideBar.icons.search,
        'search',
        iconCleanups,
      )
      applyResponsiveButtonIcon(
        findButtonByAriaLabel(scope, ICON_LABELS.filter) ?? findButtonByIconPath(scope, FILTER_ICON_PATH),
        themeConfig.sideBar.icons.filter,
        'filter',
        iconCleanups,
      )
      applyResponsiveButtonIcon(
        findButtonByAriaLabel(scope, ICON_LABELS.addWorkspace) ?? findButtonByIconPath(scope, ADD_WORKSPACE_ICON_PATH),
        themeConfig.sideBar.icons.addWorkspace,
        'add-workspace',
        iconCleanups,
      )
      // 折叠：中英双语文案匹配，回退几何
      applyResponsiveButtonIcon(
        findButtonByAriaLabel(root, ICON_LABELS.collapse) ?? findButtonByIconPath(root, PANEL_ICON_PATH),
        themeConfig.sideBar.icons.collapse,
        'collapse',
        iconCleanups,
      )
    }

    syncIcons()
    const iconObserver = new MutationObserver(syncIcons)
    iconObserver.observe(root, { childList: true, subtree: true })

    console.log('🔥 sidebar root theme found', { root, header, newSession, workspace, footer })

    return () => {
      iconObserver.disconnect()
      for (const cleanup of iconCleanups.reverse()) cleanup()
      for (const cleanup of cleanups.reverse()) cleanup()
    }
  })
}

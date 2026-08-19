import { assetUrls } from './generated'

export const themeConfig = {
  hero: {
    titleLogo: {
      source: assetUrls.brandLogo,
      width: '303px',
      height: '40px',
    },
  },
  middleArea: {
    background: 'transparent',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    video: {
      source: assetUrls.wallpaper,
      opacity: '1',
      'object-fit': 'cover',
      'object-position': 'center',
    },
  },
  chatArea: {
    background: 'rgba(255, 255, 255, 0.15)',
  },
  inputArea: {
    background: 'transparent',
  },
  inputCard: {
    background: `url("${assetUrls.inputCard}")`,
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    opacity: '1',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    blur: '20px',
    hero: {
      background: 'rgba(255, 255, 255, 0.08)',
      opacity: '1',
      blur: '0px',
    },
  },
  sideBar: {
    root: {
      background: `url("${assetUrls.sideBar}")`,
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
    },
    header: {
      background: 'transparent',
    },
    newSession: {
      background: `url("${assetUrls.newSessionIcon}")`,
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      'background-size': '100% 100%',
    },
    workspace: {
      background: 'transparent',
    },
    footer: {
      background: 'transparent',
    },
    icons: {
      brand: {
        source: assetUrls.brandLogo,
        width: '182px',
        height: '24px',
      },
      newSession: {
        source: '',
        width: '0px',
        height: '0px',
      },
      collapse: {
        source: assetUrls.collapseIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
      search: {
        source: assetUrls.searchIcon,
        width: '14px',
        height: '14px',
        railWidth: '18px',
        railHeight: '18px',
      },
      filter: {
        source: assetUrls.filterIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
      addWorkspace: {
        source: assetUrls.addWorkspaceIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
      settings: {
        source: assetUrls.settingsIcon,
        railSource: assetUrls.settingsRailIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
    },
  },
  tokenOverrides: {
    '--dsw-specific-sidebar-fill': { light: 'transparent', dark: 'transparent' },
  },
} as const

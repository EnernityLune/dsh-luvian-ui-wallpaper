import { clientBundle } from '../../client/tsdown.client.ts'
import type { UserConfig } from 'tsdown'

const bundle = clientBundle('@luvian/dsh-ui-wallpaper', [
  'lib/types/index.js',
])

export default (inlineConfig: Pick<UserConfig, 'env'>): UserConfig[] =>
  bundle(inlineConfig).map((config) => config.platform === 'browser'
    ? {
        ...config,
        loader: {
          ...config.loader,
          '.png': 'dataurl',
          '.jpg': 'dataurl',
          '.mp4': 'dataurl',
          '.webm': 'dataurl',
        },
      }
    : config)

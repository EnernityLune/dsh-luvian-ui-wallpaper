# @luvian/dsh-ui-wallpaper

DeepSeek Harness Web UI 的客户端皮肤插件（品牌：弗糯糯 / nuonuo）。给侧栏、中区、输入卡、主页标题、聊天区换肤，中区循环播放静音视频壁纸。

> 这是给《汐薯小馆》作者霄用的个人皮肤插件，由 GPT 初版、WorkBuddy（渡）重构硬化。

## 兼容性

- **目标 Harness 版本**：`0.1.0-rc.5`（本插件基于该版本源码的 DOM 契约与主题 API 实现）。
- **稳定的官方契约（插件依赖这些，不会随构建变）**：
  - `data-slot="conversation"` / `data-slot="sidebar"` 等 —— Harness 的插槽接缝（scoped-slots）。
  - `data-phase`（hero / active / settling / inert）—— 会话阶段标识。
  - `data-conversation-scroll` / `data-composer-card` / `data-composer-seat` —— 官方 `data-*` 契约。
  - `ctx.theme.overrideTokens(source, tokens)` —— 来自 `@deepseek-ai/dsh-client-ui-theme` 的主题令牌 API。
- **脆弱点（已尽量降级为兜底）**：侧栏按钮图标原靠 SVG `d` 路径几何匹配，现主定位改为 `data-slot` 容器 + 中英文案归一，几何匹配仅作最后兜底。若 Harness 大改侧栏 DOM，需重新核对这里。

## 安装

```sh
# 方式一：从 GitHub 直接装（推荐，始终拿到最新源码）
dsh plugin --profile web add "github:EnernityLune/deepseek-harness-luvian-ui-wallpaper#main"

# 方式二：从 npm 装（需先 npm publish）
dsh plugin --profile web add @luvian/dsh-ui-wallpaper

# 装完重启 dsh web 并刷新页面
```

> ⚠️ 本插件**不带主题素材**（壁纸视频 / 图标是作者私人的，遵循你自己的审美）。装上后你会得到一套透明玻璃质感的骨架皮肤，**但没有壁纸**。要用自己的素材，见下。

## 用自己的素材（换肤）

```sh
# 1. 把你的壁纸视频 / 图标放进 src/client/assets/（或在 theme.config.json 里改路径指向本地文件）
# 2. 仅检查素材是否齐全：
pnpm assets:check
# 3. 一键生成素材接入 + 打包：
pnpm bundle
# 4. 重新挂到本地 Harness 验证：
dsh plugin --profile web add "link:$(pwd)"
```

## 开发（源码构建）

```sh
# 改素材：只编辑 theme.config.json 里的 assets 路径（不碰 TS）
pnpm assets:check
pnpm bundle
```

构建产物在 `lib/client.js`，由 `cordis.patch.yml`（id `luvian-wallpaper`）随 Harness 启动自动加载。运行时控制台会打印 `🔥 Luvian theme loaded, nuonuo`。

## 素材降级

- 视频缺失 → 中区只无视频壁纸，不崩。
- 图片缺失 → 自动用 1×1 透明占位兜底，不崩。

## 目录

```
src/
  index.ts                 宿主加载入口（空壳，逻辑全在 client）
  client/
    index.ts               插件注册点，挂各 applyX 并管理卸载
    dom.ts                 waitForElement / applyInlineStyles / replaceSvgWithImage
    theme/
      config.ts            视觉参数 + tokenOverrides（集中配置）
      generated.ts         由 build-theme.mjs 自动生成（勿手改）
    components/            每界面区域一个 applyX
scripts/build-theme.mjs    读 theme.config.json → 生成 generated.ts
theme.config.json          用户唯一要改的文件（换图换视频）
```

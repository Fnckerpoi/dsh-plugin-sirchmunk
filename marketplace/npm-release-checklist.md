# npm 发布核对清单（dsh-plugin-sirchmunk）

> 目标：把 `dsh-plugin-sirchmunk` 发布到 npm，使 1024 Store / awesome-dsh-plugin / DSH 桌面商店能识别并一键安装。
> 只有发布到 npm 且 `latest` 声明 `dsh.bundle` 的包，市场才会提供「自动安装」命令；否则只以浏览模式收录。

## 发布前核对（仓库内）

- [x] `package.json` 声明 `dsh.bundle.patch`（`./cordis.patch.yml`）——已存在
- [x] `cordis.patch.yml` 已提交到 git 仓库——已存在
- [x] `files` 字段包含 `lib`、`skills`、`cordis.patch.yml`、`README.md`、`LICENSE`——已存在
- [x] `prepack` 脚本会在打包前重建入口——已存在（`npm run build`）
- [ ] `repository` 字段指向 GitHub 仓库（市场需要「npm 包 ↔ 仓库」关联）——需要补
- [ ] version 确认：当前 `1.0.0`，若发布过旧版请按 semver 递增
- [ ] `keywords` / `author` / `homepage` 非必需，建议补充方便检索

## 发布前验证（本地）

在**你自己有 node/npm 的环境**（本机工作区终端没有 npm，需用 nvm 或其他 Node 环境）执行：

```bash
npm ci             # 若是干净环境
npm run typecheck  # TS 类型检查应通过
npm run build      # 同时重建 lib/index.js 与 lib/client.js
npm pack --dry-run # 预览 npm 将包含的文件清单，确认 lib/ skills/ cordis.patch.yml 在内
```

## 补 repository 字段

编辑 `package.json`，在 `"license"` 之后加入：

```jsonc
"repository": {
  "type": "git",
  "url": "https://github.com/Fnckerpoi/dsh-plugin-sirchmunk.git"
},
"homepage": "https://github.com/Fnckerpoi/dsh-plugin-sirchmunk#readme",
"author": "Fnckerpoi",
"keywords": ["dsh", "deepseek-harness", "sirchmunk", "knowledge-graph", "plugin"]
```

（`repository` 必须指向本列表收录的那个仓库；否则市场的 包↔仓库 映射不会建立。）

## 发布

```bash
npm login                                  # 若未登录，填入你的 npm 账号
npm publish                                # prepack 会自动先构建
npm view dsh-plugin-sirchmunk version      # 验证 published
npm view dsh-plugin-sirchmunk dsh          # 验证 dsh.bundle 元数据出现在 registry
```

## 发布后验证

- [ ] `https://registry.npmjs.org/dsh-plugin-sirchmunk` 返回 200（不再是 404）
- [ ] `npm view dsh-plugin-sirchmunk` 显示 `dsh: { bundle: { patch: './cordis.patch.yml' } }`
- [ ] 等 1024 Store 采集任务刷新后，deepseek1024.com 该条目将出现安装命令 `dsh1024 plugin --profile web add dsh-plugin-sirchmunk`
- [ ] 浏览器版条目显示下载量与安装方法

## 常见问题

- **npm 包名冲突**：`dsh-plugin-sirchmunk` 目前未占用（registry 404），第一次发布即可占名；发布后不可改名。
- **注册表指向私有源**：确认 `npm config get registry` 为官方 `https://registry.npmjs.org/`。
- **peerDependencies `react`/`react-dom`** 由 DSH 运行时提供，务必保持 peer 声明，勿转为 dependencies。
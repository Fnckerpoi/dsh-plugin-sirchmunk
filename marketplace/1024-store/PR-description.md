# PR：提交 dsh-plugin-sirchmunk 到 1024 Store 目录

> 目标仓库：https://github.com/imsai-sh/awesome-deepseek-harness-plugins
> 变更范围：仅新增 1 个文件 `catalog/plugins/fnckerpoi--dsh-plugin-sirchmunk.json`

## PR 标题

```
feat: add Fnckerpoi/dsh-plugin-sirchmunk
```

## PR 描述（可直接粘贴）

```markdown
新增一个目录条目：**Fnckerpoi/dsh-plugin-sirchmunk**。

- id：`Fnckerpoi/dsh-plugin-sirchmunk`（仓库级插件）
- 类别：`tools`
- 仓库：https://github.com/Fnckerpoi/dsh-plugin-sirchmunk
- 仓库已带 `dsh-plugin` GitHub topic，`package.json` 已声明 `dsh.bundle.patch`（`./cordis.patch.yml`，patch 文件已提交在库中）。

说明：
- npm 包 `dsh-plugin-sirchmunk` 正在发布中；发布完成后 1024 Store 会自动检测到已发布且声明 `dsh.bundle` 的包，该条目即可获得安装命令（当前期间以浏览模式收录）。
- 本 PR 只新增一个条目文件，未改动 README 与其他路径。

请自动审查通过后合并，谢谢。
```

## 提交步骤

1. Fork `imsai-sh/awesome-deepseek-harness-plugins` 并新建分支 `feat/add-dsh-plugin-sirchmunk`。
2. 将本目录下的
   `fnckerpoi--dsh-plugin-sirchmunk.json`
   放到仓库的 `catalog/plugins/` 目录（保持文件名小写、id 各段以 `--` 连接）。
3. 提交这 1 个文件（不要动 README、脚本、workflow）。
4. 发起 PR，粘贴上面标题与描述。
5. 通过 `Plugin submission review / static-review` 后会自动 squash-merge，随后 CI 自动同步到 deepseek1024.com 与 DSH 桌面插件市场的内置 1024 Store 来源。

> 提示：也可以使用官方 Agent Skill 全自动完成：
> `npx skills add imsai-sh/awesome-deepseek-harness-plugins --skill submit-dsh-plugin -g`，然后让助手按 `$submit-dsh-plugin` 检查并提交。
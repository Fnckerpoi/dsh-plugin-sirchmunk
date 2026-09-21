# PR：awesome-dsh-plugin 收录 dsh-plugin-sirchmunk

> 目标仓库：https://github.com/awesome-dsh-plugin/awesome-dsh-plugin
> 变更范围：仅新增 1 个文件：`data/plugins/fnckerpoi__dsh-plugin-sirchmunk.yml`

## PR 标题

```
chore: add Fnckerpoi/dsh-plugin-sirchmunk
```

## PR 描述（可直接粘贴）

```markdown
新增一个插件条目：**Fnckerpoi/dsh-plugin-sirchmunk**。

- 仓库：https://github.com/Fnckerpoi/dsh-plugin-sirchmunk
- 分类：`tools`
- 仓库 `package.json` 已声明 `dsh.bundle.patch`（`./cordis.patch.yml`，patch 文件已提交）。
- 仓库创建于 2026-09-19，满足 1 天年龄门槛，且已带 `dsh-plugin` topic。
- 仅新增 `data/plugins/fnckerpoi__dsh-plugin-sirchmunk.yml` 一个文件，未改动 README 等生成文件。

说明描述为事实陈述（两款均与 README 及源码一致）。请 CI 校验。
```

**提交步骤**

1. Fork `awesome-dsh-plugin/awesome-dsh-plugin`，新建分支。
2. 将 `fnckerpoi__dsh-plugin-sirchmunk.yml` 放入 `data/plugins/`（文件名规则：`owner__repo.yml`）。
3. 提交 PR。CI 会依次检查：条目数（≤3）、`dsh.bundle` 声明、仓库年龄（≥1 天）、awesome-lint 与站点构建。
4. CI 通过后由维护者人工复核并合并；合并后 README 自动重新生成、网站自动重建。

**注意**：描述中若含 `: `（英文冒号+空格）必须用引号包住。本文件中的描述不含该序列，如后续修改请留意。
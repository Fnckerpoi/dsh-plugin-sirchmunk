# dsh-plugin-sirchmunk 插件市场上架指南

本项目用于把 `dsh-plugin-sirchmunk`（DSH 原生 Web 插件）提交收录到 DSH 插件生态的市场。

## 总体路线

```text
git push（仓库已带 dsh-plugin topic，等自动收集兜底）
      │
      ├─ ① PR 提交 1024 Store 目录（deepseek1024.com 内置来源）→ 自动合并 → 自动同步
      ├─ ② PR 提交 awesome-dsh-plugin 目录（社区来源）
      └─ ③ 发布 npm 包 → 市场显示一键安装命令
```

三条路径互相独立、可并行。推荐顺序：先 PR 提交目录（快，确定性收录），随后发布 npm（获得「可安装」资格），最后可选做 dshfind.

## 目录结构

```text
marketplace/
├── README.md                     ← 本指南
├── npm-release-checklist.md      ← npm 发布核对清单
├── 1024-store/
│   ├── fnckerpoi--dsh-plugin-sirchmunk.json   ← 1024 Store 目录条目（1 个文件）
│   └── PR-description.md                       ← 1024 Store PR 文案+步骤
└── awesome-dsh-plugin/
    ├── fnckerpoi__dsh-plugin-sirchmunk.yml      ← awesome-dsh-plugin 目录条目（1 个文件）
    └── PR-description.md                        ← awesome-dsh-plugin PR 文案+步骤
```

> ⚠️ 这两个目录条目文件在发起 PR 时才需要提交到**目标仓库**（fork 后在 PR 里提交），不要提交到本插件仓库（本仓库里保留一份便于复用即可，非必须）。

---

## ① 1024 Store（内置合作来源，推荐优先）

**机制**：DSH 桌面的「插件市场 → 发现」默认从 deepseek1024.com 目录读取。目录两条收录通道：

- **自动收集**：带 `dsh-plugin` topic 的 GitHub 仓库会被定时扫描；已具备条件（本仓库已带 topic、`dsh.bundle.patch` 声明且 patch 文件已提交）。缺点是采集由维护者运营、非实时。
- **PR 收录（确定性通道）**：给 `imsai-sh/awesome-deepseek-harness-plugins` 提 PR，新增 `catalog/plugins/fnckerpoi--dsh-plugin-sirchmunk.json` 一个文件，通过静态校验后**自动 squash-merge**，CI 同步到生产目录 → deepseek1024.com 与 DSH 桌面市场立即可见。

**执行**：见 [`1024-store/PR-description.md`](1024-store/PR-description.md)（含可直接粘贴的 PR 文案与步骤；也可用官方 `$submit-dsh-plugin` Skill 全自动）。

**安装能力**：1024 Store 只从 npm 安装。未发布 npm 包时条目为「浏览模式」（有仓库链接、无自动安装）。发布 npm 后自动获得安装命令。

---

## ② awesome-dsh-plugin（社区目录）

另一份社区插件清单，含 PR 收录（`data/plugins/<owner>__<repo>.yml` 一个文件）。CI 检查条目数 ≤3、`dsh.bundle` 声明、仓库年龄 ≥1 天、awesome-lint。合并前维护者会阅读仓库核对描述真实性。

**发布**：见 `awesome-dsh-plugin/PR-description.md`。

---

## ③ npm 发布（一键安装前置）

**只发布 npm 且 `latest` 声明 `dsh.bundle` 的包，市场才提供安装命令。** 目前 `dsh-plugin-sirchmunk` 尚未发布（registry 404）。

**发布**：按 `npm-release-checklist.md` 执行。注意：

- `package.json` 的 `repository` 必须指向本仓库（市场据此建立 包↔仓库 关联）；本仓库的 `repository` 字段已在提交材料中补上。
- 发布后 1024 Store 自动识别新发布的包，条目自动「升级」为可安装。
- 一旦发布，包名不可改，请确认版本号。

---

## ④ 可选：dshfind.com（另一合作来源）

- 在 https://dshfind.com 按其平台流程提交（同一插件可同时出现在多个来源）。
- DSH 桌面市场的「来源」页面可自行添加任意符合 `catalog-source` 合同的目录 manifest；如果将来想把自己搭的目录或公司内部源做成**内置合作来源**，需到 DSH 桌面官方 issue（https://github.com/anywhere-labs/deepseek-harness-desktop/issues）提出合作申请。

---

## 流程与时间线

| 步骤 | 产出 | 谁来做 | 预计 |
|---|---|---|---|
| 提交 1024 Store PR | 目录条目合并 → 网站可见 | 你（GitHub） | 自动合并后即生效 |
| 发布 npm 1.0.0 | 包在 registry | 你（npm 账号） | 当天 |
| 提交 awesome-dsh-plugin PR | 清单条目 | 你（GitHub） | 维护者复核后合并 |
| 1024 Store 定时采集刷新 | 网站出现安装命令 | 自动采集 | 发布 npm 后短日内 |

## 状态记录

- 仓库：`https://github.com/Fnckerpoi/dsh-plugin-sirchmunk`（public，带 `dsh-plugin` topic）
- npm：`dsh-plugin-sirchmunk` 未发布（2026-09-21 校验：registry 404）
- dshfind：未提交（可选）
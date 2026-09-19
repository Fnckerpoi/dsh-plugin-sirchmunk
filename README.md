# dsh-plugin-sirchmunk

[English](#english) | [中文](#中文)

## English

### Overview

`dsh-plugin-sirchmunk` is a DSH-native web plugin that adds a **Sirchmunk** section to the DSH settings interface. The section provides one place to inspect knowledge graphs, manage clusters, review shared history, monitor runtime metrics, and configure privacy controls.

The current UI uses a local Sirchmunk service health endpoint at `http://localhost:8584/api/v1/health`. Graph, cluster, history, and metrics data are represented by the API adapter in `src/services/api.ts`, which can be connected to the production backend without changing the DSH plugin entry points.

### Architecture

The package follows the DSH host/client split:

```text
cordis.patch.yml
    └─ registers dsh-plugin-sirchmunk as the sirchmunk bundle entry

lib/index.js
    └─ host entry: exports name and apply(ctx)

lib/client.js
    └─ browser entry: window.__ModuleLoader__.load(...)
         └─ apply(ctx)
              └─ settings.section / sirchmunk / order 35
                   └─ src/App.tsx
                        ├─ graph view
                        ├─ cluster manager
                        ├─ shared history
                        ├─ runtime metrics
                        └─ privacy and permission settings
```

`React` and `ReactDOM` are peer dependencies supplied by the DSH runtime. The browser build treats both packages as external dependencies, so they are not embedded in the published client bundle.

### Features

- **Knowledge graph:** displays graph nodes and exports the current graph as JSON.
- **Cluster management:** lists clusters and guards destructive operations behind an explicit write-permission toggle and confirmation step.
- **Runtime monitoring:** displays CPU, memory, and uptime metrics exposed by the Sirchmunk API adapter.
- **Shared history:** presents timestamped audit and activity events.
- **Privacy and masking:** enables sensitive-data masking, configurable mask keywords, and a global write-permission control.
- **DSH-native settings integration:** registers the section through the `settings.section` slot with ID `sirchmunk` and order `35`.
- **Bundled Agent Skill (`sirchmunk-search`):** provides a standardized skill that allows users and agents to actively query local knowledge and documents across 100+ file formats (PDF, DOCX, XLSX, Markdown, code, etc.) using the Sirchmunk MCP search tool (`mcp__sirchmunk__sirchmunk_search`). Supports `FAST`, `DEEP`, and `FILENAME_ONLY` modes.

### Install in DSH

#### Published package

Install the package in the same Node.js package environment used by the DSH host:

```bash
npm install dsh-plugin-sirchmunk
```

The package metadata points DSH to `cordis.patch.yml`, the host entry at `lib/index.js`, and the web client entry at `lib/client.js`. Restart the DSH host after installation so that it can apply the bundle patch and load the browser module. The settings interface will then expose **Sirchmunk** in the `settings.section` slot.

#### Local package

Build the project and install its directory into the DSH package environment:

```bash
cd /path/to/dsh-plugin-sirchmunk
npm install
npm run build

cd /path/to/your/dsh-package-environment
npm install /path/to/dsh-plugin-sirchmunk
```

Restart DSH after replacing or upgrading a local build.

### Local development

Requirements:

- Node.js 18 or later
- npm
- A DSH host for end-to-end plugin loading
- Optional Sirchmunk backend at `http://localhost:8584`

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Run static type checking and create the DSH package entries:

```bash
npm run typecheck
npm run build
```

The build produces:

- `lib/index.js`: ESM host entry.
- `lib/client.js`: CommonJS client bundle wrapped by `window.__ModuleLoader__.load`.

Create and inspect the exact npm publication archive before publishing:

```bash
npm pack --dry-run
```

`npm publish` runs the `prepack` script, which rebuilds both entries before npm creates the archive.

## 中文

### 项目简介

`dsh-plugin-sirchmunk` 是一个 DSH 原生 Web 插件，用于在 DSH 设置界面中注册 **Sirchmunk** 设置区域。该页面集中提供知识图谱、聚类管理、共享历史、运行监控以及隐私与权限设置。

当前 UI 会通过 `http://localhost:8584/api/v1/health` 检查本地 Sirchmunk 服务状态。图谱、聚类、历史和监控数据通过 `src/services/api.ts` 中的 API 适配层访问，后续可在不改动 DSH 插件入口的前提下接入生产后端。

### 架构设计

该包按照 DSH 的 Host/Client 双入口模式组织：

```text
cordis.patch.yml
    └─ 将 dsh-plugin-sirchmunk 注册为 sirchmunk bundle 入口

lib/index.js
    └─ Host 入口：导出 name 和 apply(ctx)

lib/client.js
    └─ Browser 入口：window.__ModuleLoader__.load(...)
         └─ apply(ctx)
              └─ settings.section / sirchmunk / order 35
                   └─ src/App.tsx
                        ├─ 图谱视图
                        ├─ 聚类管理
                        ├─ 共享历史
                        ├─ 运行监控
                        └─ 隐私和权限设置
```

`React` 和 `ReactDOM` 由 DSH 运行时提供，并作为 peer dependency 声明。Browser 构建会将它们外置，不将 React 运行时打入发布包。

### 功能特性

- **知识图谱：** 展示图谱节点，并可将当前图谱导出为 JSON。
- **聚类管理：** 展示聚类列表，对删除等操作增加全局写权限和二次确认。
- **运行监控：** 展示 Sirchmunk API 适配层返回的 CPU、内存和运行时长指标。
- **共享历史：** 展示带时间戳的审计与活动记录。
- **隐私与脱敏：** 提供敏感信息脱敏开关、可配置关键词和全局写操作权限。
- **DSH 原生设置集成：** 通过 `settings.section` slot 注册，ID 为 `sirchmunk`，顺序为 `35`。
- **内置 Agent Skill (`sirchmunk-search`)：** 提供内置的技能规范，支持使用者或 Agent 主动调用 Sirchmunk MCP 检索工具（`mcp__sirchmunk__sirchmunk_search`）对本地文档与知识库进行跨格式（PDF、Word、Excel、PPTX、Markdown、代码等 100+ 种格式）查询，支持 `FAST` 快速匹配、`DEEP` 深度大模型综合分析与 `FILENAME_ONLY` 仅文件名匹配模式。

### 在 DSH 中安装

#### 安装已发布包

在 DSH Host 使用的 Node.js 包环境中安装：

```bash
npm install dsh-plugin-sirchmunk
```

包元数据会将 DSH 指向 `cordis.patch.yml`、Host 入口 `lib/index.js` 和 Web Client 入口 `lib/client.js`。安装后重启 DSH Host，使其应用 bundle patch 并加载浏览器模块。加载成功后，设置界面的 `settings.section` 会出现 **Sirchmunk**。

#### 安装本地包

先构建项目，再将项目目录安装到 DSH 的包环境：

```bash
cd /path/to/dsh-plugin-sirchmunk
npm install
npm run build

cd /path/to/your/dsh-package-environment
npm install /path/to/dsh-plugin-sirchmunk
```

替换或升级本地构建后需要重启 DSH。

### 本地开发指南

环境要求：

- Node.js 18 或更高版本
- npm
- 用于端到端加载验证的 DSH Host
- 可选：运行在 `http://localhost:8584` 的 Sirchmunk 后端

安装依赖并启动 Vite 开发服务：

```bash
npm install
npm run dev
```

运行静态类型检查并生成 DSH 发布入口：

```bash
npm run typecheck
npm run build
```

构建产物：

- `lib/index.js`：ESM Host 入口。
- `lib/client.js`：由 `window.__ModuleLoader__.load` 包裹的 CommonJS Client bundle。

发布前生成并检查 npm 实际打包清单：

```bash
npm pack --dry-run
```

`npm publish` 会自动执行 `prepack`，在 npm 生成发布包之前重建两个入口。

# 业务对象基线 (阶段一确认)

## DSH 插件自身管理对象
1. **OBJ-01 服务连接 (SirchmunkConnection)**: 表示 DSH 访问的一个 Sirchmunk 实例。
2. **OBJ-02 MCP 绑定 (McpBinding)**: 记录服务连接与 DSH MCP 连接器间的一对一绑定。
3. **OBJ-03 管理页面入口 (ManagementPageEntry)**: DSH 设置项下访问的图谱/历史/配置等非 Chat 页面配置。

## 运行时对象 (沿用 DSH 轨迹，不建新表)
4. **OBJ-04 检索委托 (SearchDelegation)**: 一次向 Sirchmunk 发起的 MCP 调用。
5. **OBJ-05 检索结果 (SearchResult)**: Sirchmunk 的答复与来源。
6. **OBJ-06 证据来源引用 (EvidenceSourceRef)**: 高保真定位；路径按 DSH 工作区权限脱敏展示。

## Sirchmunk 外部权威对象 (不复制数据，仅消费 API)
7. **OBJ-07 外部知识聚类引用 (ExternalClusterRef)**: 聚类节点。
8. **OBJ-08 外部图谱关系引用 (ExternalGraphRelation)**: 关联有向边。

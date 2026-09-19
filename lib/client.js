window.__ModuleLoader__.load({
  id: 'dsh-plugin-sirchmunk',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const SirchmunkAPI = {
  getGraph: async () => {
    return {
      nodes: [
        { id: "1", label: "Node 1" },
        { id: "2", label: "Node 2" }
      ],
      edges: [
        { source: "1", target: "2" }
      ]
    };
  },
  getClusters: async () => {
    return [
      { id: "c1", name: "Cluster 1", size: 10 },
      { id: "c2", name: "Cluster 2", size: 5 }
    ];
  },
  deleteCluster: async (id, token) => {
    console.log(id, token);
    return { success: true };
  },
  getHistory: async () => {
    return [
      { id: "h1", timestamp: "2026-09-18T10:00:00Z", event: "Scan Started", details: "Started scanning cluster 1" },
      { id: "h2", timestamp: "2026-09-18T10:05:00Z", event: "Scan Completed", details: "Completed scanning cluster 1" }
    ];
  },
  getMetrics: async () => {
    return {
      cpu: 45.5,
      memory: 1024,
      uptime: "15d 4h"
    };
  }
};
const GraphView = () => {
  const [graphData, setGraphData] = react.useState(null);
  react.useEffect(() => {
    SirchmunkAPI.getGraph().then(setGraphData).catch(console.error);
  }, []);
  const handleExport = () => {
    if (!graphData)
      return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graphData));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "graph_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "知识图谱 (UI-04)" }),
    /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: handleExport, disabled: !graphData, children: "导出图谱" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: "10px" }, children: graphData ? /* @__PURE__ */ jsxRuntime.jsx("ul", { children: graphData.nodes.map((node) => /* @__PURE__ */ jsxRuntime.jsx("li", { children: node.label }, node.id)) }) : /* @__PURE__ */ jsxRuntime.jsx("p", { children: "加载中..." }) })
  ] });
};
const PermissionContext = react.createContext({
  hasWritePermission: false,
  setWritePermission: () => {
  }
});
const PermissionProvider = ({ children }) => {
  const [hasWritePermission, setWritePermission] = react.useState(false);
  return /* @__PURE__ */ jsxRuntime.jsx(PermissionContext.Provider, { value: { hasWritePermission, setWritePermission }, children });
};
const usePermission = () => react.useContext(PermissionContext);
const ClusterManager = () => {
  const [clusters, setClusters] = react.useState([]);
  const { hasWritePermission } = usePermission();
  const loadClusters = () => {
    SirchmunkAPI.getClusters().then(setClusters).catch(console.error);
  };
  react.useEffect(() => {
    loadClusters();
  }, []);
  const handleDelete = async (id) => {
    if (!hasWritePermission) {
      alert("操作被拒绝：未开启全局写操作权限。请在“隐私与权限设置”中开启。");
      return;
    }
    const userInput = prompt("请输入 'confirm' 确认删除该聚类");
    if (userInput === "confirm") {
      const token = localStorage.getItem("auth_token") || "dummy-token";
      try {
        await SirchmunkAPI.deleteCluster(id, token);
        alert("删除成功");
        loadClusters();
      } catch (err) {
        alert("删除失败");
      }
    } else if (userInput !== null) {
      alert("输入不匹配，取消删除");
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "聚类管理 (UI-05)" }),
    clusters.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx("ul", { children: clusters.map((cluster) => /* @__PURE__ */ jsxRuntime.jsxs("li", { style: { marginBottom: "10px" }, children: [
      cluster.name,
      " (大小: ",
      cluster.size,
      ")",
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: () => handleDelete(cluster.id),
          style: { marginLeft: "10px", color: "red", opacity: hasWritePermission ? 1 : 0.5 },
          title: hasWritePermission ? "删除此聚类" : "需要写操作权限",
          children: "删除"
        }
      )
    ] }, cluster.id)) }) : /* @__PURE__ */ jsxRuntime.jsx("p", { children: "暂无聚类或正在加载..." })
  ] });
};
const HistoryView = () => {
  const [history, setHistory] = react.useState([]);
  const [loading, setLoading] = react.useState(true);
  react.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await SirchmunkAPI.getHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "共享历史 (UI-06)" }),
    loading ? /* @__PURE__ */ jsxRuntime.jsx("p", { children: "加载中..." }) : /* @__PURE__ */ jsxRuntime.jsx("ul", { style: { listStyleType: "none", padding: 0 }, children: history.map((event) => /* @__PURE__ */ jsxRuntime.jsxs("li", { style: { marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid #eee" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("strong", { children: event.timestamp }),
      " - ",
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: event.event }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { style: { margin: "5px 0 0 0", color: "#555" }, children: event.details })
    ] }, event.id)) })
  ] });
};
const MetricsView = () => {
  const [metrics, setMetrics] = react.useState(null);
  const [loading, setLoading] = react.useState(true);
  react.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await SirchmunkAPI.getMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "运行监控 (UI-07)" }),
    loading ? /* @__PURE__ */ jsxRuntime.jsx("p", { children: "加载中..." }) : metrics ? /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "CPU 使用率:" }),
        " ",
        metrics.cpu,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "内存使用量:" }),
        " ",
        metrics.memory,
        " MB"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "运行时间:" }),
        " ",
        metrics.uptime
      ] })
    ] }) : /* @__PURE__ */ jsxRuntime.jsx("p", { children: "暂无数据" })
  ] });
};
const PrivacySettings = () => {
  const [maskKeywords, setMaskKeywords] = react.useState("password, secret");
  const [maskEnabled, setMaskEnabled] = react.useState(true);
  const [saved, setSaved] = react.useState(false);
  const { hasWritePermission, setWritePermission } = usePermission();
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "隐私与权限设置 (UI-08)" }),
    /* @__PURE__ */ jsxRuntime.jsxs("form", { onSubmit: handleSave, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginBottom: "15px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "全局权限控制" }),
        /* @__PURE__ */ jsxRuntime.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "checkbox",
              checked: hasWritePermission,
              onChange: (e) => setWritePermission(e.target.checked)
            }
          ),
          " 开启写操作权限 (跨对象联动 R-08)"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "12px", color: "#666", marginTop: "5px" }, children: "开启后，允许在聚类管理等模块执行删除、修改等写操作。" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginBottom: "10px" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "数据脱敏" }),
        /* @__PURE__ */ jsxRuntime.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "checkbox",
              checked: maskEnabled,
              onChange: (e) => setMaskEnabled(e.target.checked)
            }
          ),
          " 启用敏感信息脱敏"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginBottom: "10px" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { style: { display: "block", marginBottom: "5px" }, children: "脱敏关键字 (用逗号分隔):" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "text",
            value: maskKeywords,
            onChange: (e) => setMaskKeywords(e.target.value),
            style: { width: "100%", padding: "8px", boxSizing: "border-box" },
            disabled: !maskEnabled
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { type: "submit", style: { padding: "8px 16px" }, children: "保存设置" }),
      saved && /* @__PURE__ */ jsxRuntime.jsx("span", { style: { marginLeft: "10px", color: "green" }, children: "已保存!" })
    ] })
  ] });
};
const App = () => {
  const [status, setStatus] = react.useState("checking");
  const [activeTab, setActiveTab] = react.useState("graph");
  const checkConnection = async () => {
    setStatus("checking");
    try {
      let response = await fetch("http://localhost:8584/health");
      if (!response.ok) {
        response = await fetch("http://localhost:8584/api/v1/health");
      }
      if (response.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch (err) {
      try {
        const fallback = await fetch("http://localhost:8584/api/v1/health");
        setStatus(fallback.ok ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    }
  };
  react.useEffect(() => {
    checkConnection();
    const timer = setInterval(checkConnection, 1e4);
    return () => clearInterval(timer);
  }, []);
  const renderContent = () => {
    switch (activeTab) {
      case "graph":
        return /* @__PURE__ */ jsxRuntime.jsx(GraphView, {});
      case "cluster":
        return /* @__PURE__ */ jsxRuntime.jsx(ClusterManager, {});
      case "history":
        return /* @__PURE__ */ jsxRuntime.jsx(HistoryView, {});
      case "metrics":
        return /* @__PURE__ */ jsxRuntime.jsx(MetricsView, {});
      case "settings":
        return /* @__PURE__ */ jsxRuntime.jsx(PrivacySettings, {});
      default:
        return /* @__PURE__ */ jsxRuntime.jsx(GraphView, {});
    }
  };
  const tabStyle = (tabName) => ({
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: activeTab === tabName ? "#007bff" : "#f1f1f1",
    color: activeTab === tabName ? "#fff" : "#333",
    border: "none",
    borderBottom: activeTab === tabName ? "2px solid #0056b3" : "none",
    outline: "none",
    marginRight: "5px",
    borderRadius: "4px 4px 0 0"
  });
  return /* @__PURE__ */ jsxRuntime.jsx(PermissionProvider, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "20px", maxWidth: "1200px", margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { children: "Sirchmunk 概览" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { children: "这里是 DSH 插件 Sirchmunk 的设置页面和功能概览。" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginBottom: "20px", padding: "15px", backgroundColor: "#e9ecef", borderRadius: "8px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { style: { marginTop: 0, marginBottom: "8px" }, children: "连接状态" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: checkConnection,
            style: {
              padding: "4px 10px",
              fontSize: "12px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              backgroundColor: "#fff"
            },
            children: "🔄 检查连接"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { style: { margin: "5px 0" }, children: [
        "后台服务 (http://localhost:8584):",
        " ",
        status === "checking" && /* @__PURE__ */ jsxRuntime.jsx("span", { children: "检查中..." }),
        status === "online" && /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "green", fontWeight: "bold" }, children: "在线 (Online)" }),
        status === "offline" && /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "red", fontWeight: "bold" }, children: "离线 (Offline)" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { style: { margin: "5px 0" }, children: [
        "MCP 状态: ",
        status === "online" ? /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "green", fontWeight: "bold" }, children: "已连接" }) : /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "gray" }, children: "等待后台连接..." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", borderBottom: "1px solid #ccc", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { style: tabStyle("graph"), onClick: () => setActiveTab("graph"), children: "图谱视图" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { style: tabStyle("cluster"), onClick: () => setActiveTab("cluster"), children: "聚类管理" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { style: tabStyle("history"), onClick: () => setActiveTab("history"), children: "审计日志" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { style: tabStyle("metrics"), onClick: () => setActiveTab("metrics"), children: "监控指标" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { style: tabStyle("settings"), onClick: () => setActiveTab("settings"), children: "隐私与权限" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { minHeight: "400px" }, children: renderContent() })
  ] }) });
};
const name = "dsh-plugin-sirchmunk";
const inject = ["slots"];
function apply(ctx) {
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "sirchmunk",
    order: 35,
    label: () => "Sirchmunk",
    locale: "settings.sirchmunk"
  }, App));
}
exports.apply = apply;
exports.inject = inject;
exports.name = name;

    return module.exports;
  }
});

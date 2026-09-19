export interface GraphData {
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ source: string; target: string }>;
}

export interface ClusterData {
  id: string;
  name: string;
  size: number;
}

export interface HistoryEvent {
  id: string;
  timestamp: string;
  event: string;
  details: string;
}

export interface MetricsData {
  cpu: number;
  memory: number;
  uptime: string;
}

export const SirchmunkAPI = {
  getGraph: async (): Promise<GraphData> => {
    // 模拟接口
    return {
      nodes: [
        { id: '1', label: 'Node 1' },
        { id: '2', label: 'Node 2' },
      ],
      edges: [
        { source: '1', target: '2' }
      ]
    };
  },
  getClusters: async (): Promise<ClusterData[]> => {
    // 模拟接口
    return [
      { id: 'c1', name: 'Cluster 1', size: 10 },
      { id: 'c2', name: 'Cluster 2', size: 5 },
    ];
  },
  deleteCluster: async (id: string, token: string): Promise<{ success: boolean }> => {
    // 模拟接口
    console.log(id, token);
    return { success: true };
  },
  getHistory: async (): Promise<HistoryEvent[]> => {
    // 模拟接口
    return [
      { id: 'h1', timestamp: '2026-09-18T10:00:00Z', event: 'Scan Started', details: 'Started scanning cluster 1' },
      { id: 'h2', timestamp: '2026-09-18T10:05:00Z', event: 'Scan Completed', details: 'Completed scanning cluster 1' },
    ];
  },
  getMetrics: async (): Promise<MetricsData> => {
    // 模拟接口
    return {
      cpu: 45.5,
      memory: 1024,
      uptime: '15d 4h'
    };
  }
};


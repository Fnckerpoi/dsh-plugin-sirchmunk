import React, { useEffect, useState } from 'react';
import { SirchmunkAPI, MetricsData } from '../services/api';

export const MetricsView: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>运行监控 (UI-07)</h2>
      {loading ? (
        <p>加载中...</p>
      ) : metrics ? (
        <div>
          <p><strong>CPU 使用率:</strong> {metrics.cpu}%</p>
          <p><strong>内存使用量:</strong> {metrics.memory} MB</p>
          <p><strong>运行时间:</strong> {metrics.uptime}</p>
        </div>
      ) : (
        <p>暂无数据</p>
      )}
    </div>
  );
};


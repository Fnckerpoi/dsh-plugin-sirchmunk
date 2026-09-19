import React, { useEffect, useState } from 'react';
import { GraphView } from './components/GraphView';
import { ClusterManager } from './components/ClusterManager';
import { HistoryView } from './components/HistoryView';
import { MetricsView } from './components/MetricsView';
import { PrivacySettings } from './components/PrivacySettings';
import { PermissionProvider } from './PermissionContext';

export const App: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [activeTab, setActiveTab] = useState<string>('graph');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:8584/api/v1/health');
        if (response.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (err) {
        setStatus('offline');
      }
    };

    checkConnection();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'graph':
        return <GraphView />;
      case 'cluster':
        return <ClusterManager />;
      case 'history':
        return <HistoryView />;
      case 'metrics':
        return <MetricsView />;
      case 'settings':
        return <PrivacySettings />;
      default:
        return <GraphView />;
    }
  };

  const tabStyle = (tabName: string) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tabName ? '#007bff' : '#f1f1f1',
    color: activeTab === tabName ? '#fff' : '#333',
    border: 'none',
    borderBottom: activeTab === tabName ? '2px solid #0056b3' : 'none',
    outline: 'none',
    marginRight: '5px',
    borderRadius: '4px 4px 0 0'
  });

  return (
    <PermissionProvider>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Sirchmunk 概览</h1>
        <p>这里是 DSH 插件 Sirchmunk 的设置页面和功能概览。</p>
        
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>连接状态</h2>
          <p style={{ margin: '5px 0' }}>
            后台服务 (http://localhost:8584):{' '}
            {status === 'checking' && <span>检查中...</span>}
            {status === 'online' && <span style={{ color: 'green', fontWeight: 'bold' }}>在线 (Online)</span>}
            {status === 'offline' && <span style={{ color: 'red', fontWeight: 'bold' }}>离线 (Offline)</span>}
          </p>
          <p style={{ margin: '5px 0' }}>MCP 状态: {status === 'online' ? <span style={{ color: 'green', fontWeight: 'bold' }}>已连接</span> : <span style={{ color: 'gray' }}>等待后台连接...</span>}</p>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <button style={tabStyle('graph')} onClick={() => setActiveTab('graph')}>图谱视图</button>
          <button style={tabStyle('cluster')} onClick={() => setActiveTab('cluster')}>聚类管理</button>
          <button style={tabStyle('history')} onClick={() => setActiveTab('history')}>审计日志</button>
          <button style={tabStyle('metrics')} onClick={() => setActiveTab('metrics')}>监控指标</button>
          <button style={tabStyle('settings')} onClick={() => setActiveTab('settings')}>隐私与权限</button>
        </div>

        <div style={{ minHeight: '400px' }}>
          {renderContent()}
        </div>
      </div>
    </PermissionProvider>
  );
};

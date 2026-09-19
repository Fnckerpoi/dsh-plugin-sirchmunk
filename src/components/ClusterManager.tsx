import React, { useEffect, useState } from 'react';
import { SirchmunkAPI, ClusterData } from '../services/api';
import { usePermission } from '../PermissionContext';

export const ClusterManager: React.FC = () => {
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const { hasWritePermission } = usePermission();

  const loadClusters = () => {
    SirchmunkAPI.getClusters().then(setClusters).catch(console.error);
  };

  useEffect(() => {
    loadClusters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!hasWritePermission) {
      alert('操作被拒绝：未开启全局写操作权限。请在“隐私与权限设置”中开启。');
      return;
    }

    const userInput = prompt("请输入 'confirm' 确认删除该聚类");
    if (userInput === 'confirm') {
      const token = localStorage.getItem('auth_token') || 'dummy-token';
      try {
        await SirchmunkAPI.deleteCluster(id, token);
        alert('删除成功');
        loadClusters();
      } catch (err) {
        alert('删除失败');
      }
    } else if (userInput !== null) {
      alert('输入不匹配，取消删除');
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>聚类管理 (UI-05)</h2>
      {clusters.length > 0 ? (
        <ul>
          {clusters.map(cluster => (
            <li key={cluster.id} style={{ marginBottom: '10px' }}>
              {cluster.name} (大小: {cluster.size})
              <button 
                onClick={() => handleDelete(cluster.id)} 
                style={{ marginLeft: '10px', color: 'red', opacity: hasWritePermission ? 1 : 0.5 }}
                title={hasWritePermission ? '删除此聚类' : '需要写操作权限'}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>暂无聚类或正在加载...</p>
      )}
    </div>
  );
};

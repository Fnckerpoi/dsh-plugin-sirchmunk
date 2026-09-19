import React, { useEffect, useState } from 'react';
import { SirchmunkAPI, GraphData } from '../services/api';

export const GraphView: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    SirchmunkAPI.getGraph().then(setGraphData).catch(console.error);
  }, []);

  const handleExport = () => {
    if (!graphData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graphData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "graph_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>知识图谱 (UI-04)</h2>
      <button onClick={handleExport} disabled={!graphData}>导出图谱</button>
      <div style={{ marginTop: '10px' }}>
        {graphData ? (
          <ul>
            {graphData.nodes.map(node => (
              <li key={node.id}>{node.label}</li>
            ))}
          </ul>
        ) : (
          <p>加载中...</p>
        )}
      </div>
    </div>
  );
};


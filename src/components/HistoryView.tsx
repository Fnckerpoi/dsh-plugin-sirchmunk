import React, { useEffect, useState } from 'react';
import { SirchmunkAPI, HistoryEvent } from '../services/api';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>共享历史 (UI-06)</h2>
      {loading ? (
        <p>加载中...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {history.map(event => (
            <li key={event.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <strong>{event.timestamp}</strong> - <span>{event.event}</span>
              <p style={{ margin: '5px 0 0 0', color: '#555' }}>{event.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


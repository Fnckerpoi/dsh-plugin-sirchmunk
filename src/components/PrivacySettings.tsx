import React, { useState } from 'react';
import { usePermission } from '../PermissionContext';

export const PrivacySettings: React.FC = () => {
  const [maskKeywords, setMaskKeywords] = useState<string>('password, secret');
  const [maskEnabled, setMaskEnabled] = useState<boolean>(true);
  const [saved, setSaved] = useState(false);
  const { hasWritePermission, setWritePermission } = usePermission();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 在这里通常会调用API保存设置
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>隐私与权限设置 (UI-08)</h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <h3>全局权限控制</h3>
          <label>
            <input
              type="checkbox"
              checked={hasWritePermission}
              onChange={(e) => setWritePermission(e.target.checked)}
            />
            &nbsp;开启写操作权限 (跨对象联动 R-08)
          </label>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            开启后，允许在聚类管理等模块执行删除、修改等写操作。
          </p>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <h3>数据脱敏</h3>
          <label>
            <input
              type="checkbox"
              checked={maskEnabled}
              onChange={(e) => setMaskEnabled(e.target.checked)}
            />
            &nbsp;启用敏感信息脱敏
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>脱敏关键字 (用逗号分隔):</label>
          <input
            type="text"
            value={maskKeywords}
            onChange={(e) => setMaskKeywords(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            disabled={!maskEnabled}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>保存设置</button>
        {saved && <span style={{ marginLeft: '10px', color: 'green' }}>已保存!</span>}
      </form>
    </div>
  );
};

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PermissionContextType {
  hasWritePermission: boolean;
  setWritePermission: (val: boolean) => void;
}

export const PermissionContext = createContext<PermissionContextType>({
  hasWritePermission: false,
  setWritePermission: () => {},
});

export const PermissionProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [hasWritePermission, setWritePermission] = useState<boolean>(false);

  return (
    <PermissionContext.Provider value={{ hasWritePermission, setWritePermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => useContext(PermissionContext);

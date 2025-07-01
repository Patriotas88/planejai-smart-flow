
import { createContext, useContext, useState } from 'react';

type AccountType = 'personal' | 'business';

interface AppContextType {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>('personal');

  return (
    <AppContext.Provider value={{
      accountType,
      setAccountType
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

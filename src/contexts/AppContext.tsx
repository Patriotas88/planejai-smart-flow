
import { createContext, useContext, useState } from 'react';

type AccountType = 'personal' | 'business';

// Mock data for demonstration
const mockTransactions = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000,
    type: 'income' as const,
    date: '2024-01-15',
    categoryId: '1'
  },
  {
    id: '2',
    description: 'Supermercado',
    amount: 350,
    type: 'expense' as const,
    date: '2024-01-16',
    categoryId: '2'
  },
  {
    id: '3',
    description: 'Freelance',
    amount: 1200,
    type: 'income' as const,
    date: '2024-01-17',
    categoryId: '1'
  }
];

const mockCategories = [
  { id: '1', name: 'Trabalho', color: '#10B981' },
  { id: '2', name: 'Alimentação', color: '#EF4444' },
  { id: '3', name: 'Transporte', color: '#3B82F6' }
];

const mockBudgets = [
  { id: '1', categoryId: '2', amount: 500, name: 'Orçamento Alimentação' },
  { id: '2', categoryId: '3', amount: 300, name: 'Orçamento Transporte' }
];

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  name: string;
}

interface AppContextType {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getCurrentMonthTransactions: () => Transaction[];
  deleteTransaction: (transactionId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>('personal');

  const getTotalIncome = () => {
    return mockTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return mockTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCurrentMonthTransactions = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return mockTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
  };

  const deleteTransaction = async (transactionId: string) => {
    // Mock implementation - in real app this would call API
    console.log('Deleting transaction:', transactionId);
  };

  return (
    <AppContext.Provider value={{
      accountType,
      setAccountType,
      transactions: mockTransactions,
      categories: mockCategories,
      budgets: mockBudgets,
      getTotalIncome,
      getTotalExpenses,
      getBalance,
      getCurrentMonthTransactions,
      deleteTransaction
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

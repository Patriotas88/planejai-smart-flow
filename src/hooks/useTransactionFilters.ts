
import { useState, useMemo } from 'react';
import { Transaction } from '@/hooks/useTransactions';

export function useTransactionFilters(transactions: Transaction[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category_id === categoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  return {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions
  };
}

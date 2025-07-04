
import { useState } from 'react';
import { Header } from '@/components/Header';
import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { TransactionModal } from '@/components/TransactionModal';
import { AccountTypeIndicator } from '@/components/transactions/AccountTypeIndicator';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionActions } from '@/components/transactions/TransactionActions';
import { TransactionTable } from '@/components/transactions/TransactionTable';

interface TransacoesProps {
  onMenuClick?: () => void;
}

export default function Transacoes({ onMenuClick }: TransacoesProps) {
  const { 
    transactions, 
    deleteTransaction,
    isLoading 
  } = useTransactions();

  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions
  } = useTransactionFilters(transactions);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    if (transaction.type === 'income') {
      setShowIncomeModal(true);
    } else {
      setShowExpenseModal(true);
    }
  };

  const handleDelete = async (transactionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(transactionId);
    }
  };

  const handleCloseModal = () => {
    setShowIncomeModal(false);
    setShowExpenseModal(false);
    setEditingTransaction(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker-blue">
        <Header title="Transações" onMenuClick={onMenuClick} showAccountToggle />
        <main className="p-4 md:p-6">
          <div className="text-center text-white">Carregando transações...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Transações" onMenuClick={onMenuClick} showAccountToggle />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Account Type Indicator */}
        <AccountTypeIndicator />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <TransactionFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
          />

          <TransactionActions
            onAddIncome={() => setShowIncomeModal(true)}
            onAddExpense={() => setShowExpenseModal(true)}
          />
        </div>

        {/* Transactions Table */}
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Transaction Modals */}
      <TransactionModal
        open={showIncomeModal}
        onClose={handleCloseModal}
        type="income"
        transaction={editingTransaction?.type === 'income' ? editingTransaction : undefined}
      />
      
      <TransactionModal
        open={showExpenseModal}
        onClose={handleCloseModal}
        type="expense"
        transaction={editingTransaction?.type === 'expense' ? editingTransaction : undefined}
      />
    </div>
  );
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FinanceCard } from '@/components/FinanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Calendar, Plus, Edit3, BarChart3 } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { TransactionModal } from '@/components/TransactionModal';
import { AccountTypeToggle } from '@/components/AccountTypeToggle';
import { useApp } from '@/contexts/AppContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const { 
    recentTransactions, 
    totalIncome, 
    totalExpense, 
    balance, 
    isLoading 
  } = useTransactions();
  
  const { accountType } = useApp();
  const { formatCurrency } = useFormatCurrency();

  // Calcular meta mensal do localStorage
  const monthlyGoal = parseFloat(localStorage.getItem(`monthly-goal-${accountType}`) || '2000');

  const handleOpenModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setModalType(transaction.type);
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-darker-blue flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-darker-blue overflow-x-hidden">
      <Header title={`Dashboard ${accountType === 'personal' ? 'Pessoal' : 'Empresarial'}`} />
      
      <main className="p-3 sm:p-4 md:p-6 safe-area-bottom">
        {/* Toggle de Conta */}
        <div className="mb-4 md:mb-6 flex justify-end">
          <AccountTypeToggle />
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <FinanceCard
            title="Receitas"
            value={formatCurrency(totalIncome)}
            type="income"
            icon={<ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />}
          />
          <FinanceCard
            title="Despesas"
            value={formatCurrency(totalExpense)}
            type="expense"
            icon={<ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />}
          />
          <FinanceCard
            title="Saldo Atual"
            value={formatCurrency(balance)}
            type="balance"
            icon={<Calendar className="h-3 w-3 sm:h-4 sm:w-4" />}
          />
          <FinanceCard
            title="Meta Mensal"
            value={formatCurrency(monthlyGoal)}
            type="balance"
            icon={<Calendar className="h-3 w-3 sm:h-4 sm:w-4" />}
          />
        </div>

        {/* Seções Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Últimas Transações */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between text-base sm:text-lg">
                Últimas Transações
                <Button 
                  size="sm" 
                  onClick={() => handleOpenModal('income')}
                  className="bg-green-primary hover:bg-green-hover mobile-button h-8 px-2 sm:px-3"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="text-xs sm:text-sm">Adicionar</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-white font-medium truncate text-sm sm:text-base">{transaction.title}</p>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          {transaction.categories && (
                            <span className="ml-2">• {transaction.categories.name}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs sm:text-sm ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTransaction(transaction)}
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700 flex-shrink-0"
                        >
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4 text-sm">
                    Nenhuma transação encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base sm:text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Button 
                  onClick={() => handleOpenModal('income')}
                  className="bg-green-primary hover:bg-green-hover text-white flex flex-col items-center p-3 sm:p-4 md:p-6 h-auto mobile-button"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Nova Receita</span>
                </Button>
                <Button 
                  onClick={() => handleOpenModal('expense')}
                  className="bg-red-600 hover:bg-red-700 text-white flex flex-col items-center p-3 sm:p-4 md:p-6 h-auto mobile-button"
                >
                  <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Nova Despesa</span>
                </Button>
                <Button 
                  onClick={() => navigate('/planejamento')}
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 flex flex-col items-center p-3 sm:p-4 md:p-6 h-auto mobile-button"
                >
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Planejamento</span>
                </Button>
                <Button 
                  onClick={() => navigate('/relatorios')}
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 flex flex-col items-center p-3 sm:p-4 md:p-6 h-auto mobile-button"
                >
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Relatórios</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        type={modalType}
        transaction={editingTransaction}
      />
    </div>
  );
}

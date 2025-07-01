
import { useState } from 'react';
import { Header } from '@/components/Header';
import { FinanceCard } from '@/components/FinanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Calendar, Plus } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionModal } from '@/components/TransactionModal';
import { AccountTypeToggle } from '@/components/AccountTypeToggle';
import { useApp } from '@/contexts/AppContext';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  
  const { 
    recentTransactions, 
    totalIncome, 
    totalExpense, 
    balance, 
    isLoading 
  } = useTransactions();
  
  const { accountType } = useApp();

  const handleOpenModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setModalOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker-blue flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title={`Dashboard ${accountType === 'personal' ? 'Pessoal' : 'Empresarial'}`} />
      
      <main className="p-6">
        {/* Toggle de Conta */}
        <div className="mb-6 flex justify-end">
          <AccountTypeToggle />
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinanceCard
            title="Receitas"
            value={formatCurrency(totalIncome)}
            type="income"
            icon={<ArrowUp className="h-4 w-4" />}
          />
          <FinanceCard
            title="Despesas"
            value={formatCurrency(totalExpense)}
            type="expense"
            icon={<ArrowDown className="h-4 w-4" />}
          />
          <FinanceCard
            title="Saldo Atual"
            value={formatCurrency(balance)}
            type="balance"
            icon={<Calendar className="h-4 w-4" />}
          />
          <FinanceCard
            title="Meta Mensal"
            value="R$ 2.000,00"
            type="balance"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        {/* Seções Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Últimas Transações */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Últimas Transações
                <Button 
                  size="sm" 
                  onClick={() => handleOpenModal('income')}
                  className="bg-green-primary hover:bg-green-hover"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                      <div>
                        <p className="text-white font-medium">{transaction.title}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          {transaction.categories && (
                            <span className="ml-2">• {transaction.categories.name}</span>
                          )}
                        </p>
                      </div>
                      <span className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    Nenhuma transação encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleOpenModal('income')}
                  className="bg-green-primary hover:bg-green-hover text-white flex flex-col items-center p-6 h-auto"
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="text-sm">Nova Receita</span>
                </Button>
                <Button 
                  onClick={() => handleOpenModal('expense')}
                  className="bg-red-600 hover:bg-red-700 text-white flex flex-col items-center p-6 h-auto"
                >
                  <ArrowDown className="h-6 w-6 mb-2" />
                  <span className="text-sm">Nova Despesa</span>
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex flex-col items-center p-6 h-auto">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm">Planejamento</span>
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex flex-col items-center p-6 h-auto">
                  <ArrowUp className="h-6 w-6 mb-2" />
                  <span className="text-sm">Relatórios</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </div>
  );
}

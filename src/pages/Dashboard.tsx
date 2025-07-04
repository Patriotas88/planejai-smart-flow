
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  PlusCircle,
  Calendar,
  Target,
  AlertCircle,
  Edit,
  ArrowRight,
  Receipt,
  User,
  Building2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/utils';
import { formatDateToBrazilian } from '@/lib/dateUtils';
import { TransactionModal } from '@/components/TransactionModal';

interface DashboardProps {
  onMenuClick?: () => void;
}

export default function Dashboard({ onMenuClick }: DashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accountType } = useApp();
  const { 
    transactions, 
    recentTransactions,
    totalIncome,
    totalExpense,
    balance,
    isLoading: transactionsLoading 
  } = useTransactions();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const isLoading = transactionsLoading || categoriesLoading;

  // Mock data para orçamentos (implementar futuramente)
  const upcomingBudgets: any[] = [];

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    if (transaction.type === 'income') {
      setShowIncomeModal(true);
    } else {
      setShowExpenseModal(true);
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
        <Header title="Dashboard" onMenuClick={onMenuClick} showAccountToggle />
        <main className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-dark-blue border-gray-700">
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Dashboard" onMenuClick={onMenuClick} showAccountToggle />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Indicador do Perfil Ativo */}
        <Card className="bg-dark-blue border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {accountType === 'personal' ? (
                <User className="h-5 w-5 text-green-primary" />
              ) : (
                <Building2 className="h-5 w-5 text-green-primary" />
              )}
              <span className="text-white font-medium">
                Perfil {accountType === 'personal' ? 'Pessoal' : 'Empresarial'} ativo
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Receitas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-gray-400">
                Total de receitas registradas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(totalExpense)}
              </div>
              <p className="text-xs text-gray-400">
                Total de despesas registradas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Saldo
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </div>
              <p className="text-xs text-gray-400">
                Saldo atual disponível
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="bg-dark-blue border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button 
                className="bg-green-primary hover:bg-green-600 text-white"
                onClick={() => setShowIncomeModal(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => setShowExpenseModal(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
              <Button 
                variant="outline" 
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                onClick={() => navigate('/transacoes')}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Transações
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() => navigate('/planejamento')}
              >
                <Target className="h-4 w-4 mr-2" />
                Definir Meta
              </Button>
              <Button 
                variant="outline" 
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                onClick={() => navigate('/relatorios')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Ver Relatório
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* grid with recent transactions and budget alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transações Recentes */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Transações Recentes</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/transacoes')}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                >
                  Ver Todas
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => {
                    const category = categories.find(c => c.id === transaction.category_id);
                    return (
                      <div key={transaction.id} className="flex items-center justify-between group">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-white font-medium">{transaction.title}</p>
                            <p className="text-gray-400 text-sm">
                              {category?.name || 'Sem categoria'} • {formatDateToBrazilian(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`font-bold ${
                            transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTransaction(transaction)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-1 h-6 w-6"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Nenhuma transação encontrada</p>
                    <div className="space-x-2">
                      <Button 
                        size="sm"
                        className="bg-green-primary hover:bg-green-600 text-white"
                        onClick={() => setShowIncomeModal(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Adicionar Receita
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => setShowExpenseModal(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Adicionar Despesa
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Orçamento */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                Alertas de Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBudgets.length > 0 ? (
                  upcomingBudgets.map((budget) => {
                    const category = categories.find(c => c.id === budget.categoryId);
                    const spent = transactions
                      .filter(t => t.category_id === budget.categoryId && t.type === 'expense')
                      .reduce((sum, t) => sum + Number(t.amount), 0);
                    const percentage = (spent / budget.amount) * 100;
                    
                    return (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{category?.name}</span>
                          <Badge variant={percentage > 90 ? "destructive" : "secondary"}>
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              percentage > 90 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-gray-400 text-sm">
                          {formatCurrency(spent)} de {formatCurrency(budget.amount)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Nenhum orçamento configurado</p>
                    <Button 
                      size="sm"
                      variant="outline" 
                      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                      onClick={() => navigate('/planejamento')}
                    >
                      <Target className="h-4 w-4 mr-1" />
                      Configurar Orçamento
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modais de Transação */}
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

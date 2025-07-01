
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, TrendingUp, Calendar, Save, AlertCircle } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function Planejamento() {
  const { accountType } = useApp();
  const { totalIncome, totalExpense, balance, isLoading } = useTransactions();
  const { formatCurrency } = useFormatCurrency();
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState('');

  // Debug logs
  console.log('Planejamento data:', { totalIncome, totalExpense, balance, isLoading, accountType });

  // Carregar metas salvas
  useEffect(() => {
    const savedGoal = localStorage.getItem(`monthly-goal-${accountType}`);
    const savedIncomeGoal = localStorage.getItem(`monthly-income-goal-${accountType}`);
    
    console.log('Loading saved goals:', { savedGoal, savedIncomeGoal });
    
    if (savedGoal) {
      setMonthlyGoal(savedGoal);
    } else {
      setMonthlyGoal('2000'); // Valor padrão
    }
    
    if (savedIncomeGoal) {
      setMonthlyIncomeGoal(savedIncomeGoal);
    } else {
      setMonthlyIncomeGoal('5000'); // Valor padrão
    }
  }, [accountType]);

  const handleSaveGoals = () => {
    const goalValue = parseFloat(monthlyGoal) || 0;
    const incomeGoalValue = parseFloat(monthlyIncomeGoal) || 0;
    
    if (goalValue <= 0 || incomeGoalValue <= 0) {
      toast.error('Por favor, insira valores válidos para as metas');
      return;
    }
    
    localStorage.setItem(`monthly-goal-${accountType}`, goalValue.toString());
    localStorage.setItem(`monthly-income-goal-${accountType}`, incomeGoalValue.toString());
    
    toast.success('Metas salvas com sucesso!');
  };

  // Cálculos de progresso
  const currentGoal = parseFloat(monthlyGoal) || 0;
  const currentIncomeGoal = parseFloat(monthlyIncomeGoal) || 0;
  const expenseProgress = currentGoal > 0 ? Math.min((totalExpense / currentGoal) * 100, 100) : 0;
  const incomeProgress = currentIncomeGoal > 0 ? Math.min((totalIncome / currentIncomeGoal) * 100, 100) : 0;
  const balanceStatus = balance >= 0 ? 'positive' : 'negative';

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-darker-blue overflow-x-hidden">
        <Header title={`Planejamento ${accountType === 'personal' ? 'Pessoal' : 'Empresarial'}`} />
        <main className="p-3 sm:p-4 md:p-6 safe-area-bottom">
          <div className="max-w-4xl mx-auto space-y-4">
            <Card className="bg-dark-blue border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full bg-gray-700" />
                <Skeleton className="h-10 w-full bg-gray-700" />
                <Skeleton className="h-10 w-32 bg-gray-700" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-darker-blue overflow-x-hidden">
      <Header title={`Planejamento ${accountType === 'personal' ? 'Pessoal' : 'Empresarial'}`} />
      
      <main className="p-3 sm:p-4 md:p-6 safe-area-bottom">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          
          {/* Cards de Resumo Atual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Card className="bg-dark-blue border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Receitas do Mês</p>
                    <p className="text-green-400 font-bold text-lg sm:text-xl">{formatCurrency(totalIncome)}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-blue border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Despesas do Mês</p>
                    <p className="text-red-400 font-bold text-lg sm:text-xl">{formatCurrency(totalExpense)}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-red-400 flex-shrink-0 rotate-180" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-blue border-gray-700 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Saldo Atual</p>
                    <p className={`font-bold text-lg sm:text-xl ${balanceStatus === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <Calendar className={`h-6 w-6 flex-shrink-0 ${balanceStatus === 'positive' ? 'text-green-400' : 'text-red-400'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuração de Metas */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-base sm:text-lg md:text-xl">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                Definir Metas Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="incomeGoal" className="text-gray-300 text-sm">Meta de Receita Mensal (R$)</Label>
                  <Input
                    id="incomeGoal"
                    type="number"
                    value={monthlyIncomeGoal}
                    onChange={(e) => setMonthlyIncomeGoal(e.target.value)}
                    placeholder="Ex: 5000"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1 mobile-input"
                  />
                </div>

                <div>
                  <Label htmlFor="expenseGoal" className="text-gray-300 text-sm">Limite de Gastos Mensais (R$)</Label>
                  <Input
                    id="expenseGoal"
                    type="number"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value)}
                    placeholder="Ex: 2000"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1 mobile-input"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSaveGoals}
                className="w-full sm:w-auto bg-green-primary hover:bg-green-hover text-white mobile-button"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Metas
              </Button>
            </CardContent>
          </Card>

          {/* Progresso das Metas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Progresso de Receitas */}
            <Card className="bg-dark-blue border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base sm:text-lg">Progresso de Receitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Meta: {formatCurrency(currentIncomeGoal)}</span>
                    <span className="text-green-400 font-semibold text-sm">{incomeProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={incomeProgress} className="h-3" />
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-400">Atual: {formatCurrency(totalIncome)}</span>
                    <span className="text-gray-400">
                      Faltam: {formatCurrency(Math.max(0, currentIncomeGoal - totalIncome))}
                    </span>
                  </div>
                  {incomeProgress >= 100 && (
                    <div className="flex items-center text-green-400 text-xs sm:text-sm">
                      <Target className="h-4 w-4 mr-1" />
                      Meta de receita atingida!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progresso de Gastos */}
            <Card className="bg-dark-blue border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base sm:text-lg">Controle de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Limite: {formatCurrency(currentGoal)}</span>
                    <span className={`font-semibold text-sm ${expenseProgress >= 90 ? 'text-red-400' : expenseProgress >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {expenseProgress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={expenseProgress} 
                    className={`h-3 ${expenseProgress >= 90 ? '[&>div]:bg-red-500' : expenseProgress >= 70 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`} 
                  />
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-400">Gasto: {formatCurrency(totalExpense)}</span>
                    <span className="text-gray-400">
                      Restante: {formatCurrency(Math.max(0, currentGoal - totalExpense))}
                    </span>
                  </div>
                  {expenseProgress >= 90 && (
                    <div className="flex items-center text-red-400 text-xs sm:text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Atenção: Próximo do limite!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dicas e Insights */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base sm:text-lg">Insights do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {balance > 0 && (
                  <div className="flex items-start p-3 bg-green-900/20 border border-green-800 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-medium text-sm">Parabéns!</p>
                      <p className="text-gray-300 text-xs sm:text-sm">Você está com saldo positivo de {formatCurrency(balance)} este mês.</p>
                    </div>
                  </div>
                )}
                
                {expenseProgress >= 80 && expenseProgress < 100 && (
                  <div className="flex items-start p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-400 font-medium text-sm">Atenção</p>
                      <p className="text-gray-300 text-xs sm:text-sm">Você já gastou {expenseProgress.toFixed(0)}% do seu limite mensal.</p>
                    </div>
                  </div>
                )}

                {incomeProgress < 50 && (
                  <div className="flex items-start p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                    <Target className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-400 font-medium text-sm">Dica</p>
                      <p className="text-gray-300 text-xs sm:text-sm">Você ainda precisa de {formatCurrency(currentIncomeGoal - totalIncome)} para atingir sua meta de receita.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

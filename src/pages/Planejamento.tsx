
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Calendar, Save } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function Planejamento() {
  const [monthlyGoal, setMonthlyGoal] = useState(2000);
  const [goalInput, setGoalInput] = useState('2000');
  
  const { transactions, totalIncome, totalExpense } = useTransactions();
  const { formatCurrency } = useFormatCurrency();
  const { accountType } = useApp();

  // Calcular dados do mês atual
  const currentMonth = new Date().getMonth();
  const currentMonthTransactions = transactions.filter(t => {
    const transactionMonth = new Date(t.date).getMonth();
    return transactionMonth === currentMonth;
  });

  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyBalance = monthlyIncome - monthlyExpense;
  const goalProgress = Math.min((monthlyBalance / monthlyGoal) * 100, 100);

  // Carregar meta salva do localStorage
  useEffect(() => {
    const savedGoal = localStorage.getItem(`monthly-goal-${accountType}`);
    if (savedGoal) {
      const goal = parseFloat(savedGoal);
      setMonthlyGoal(goal);
      setGoalInput(goal.toString());
    }
  }, [accountType]);

  const handleSaveGoal = () => {
    const newGoal = parseFloat(goalInput);
    if (newGoal > 0) {
      setMonthlyGoal(newGoal);
      localStorage.setItem(`monthly-goal-${accountType}`, newGoal.toString());
      toast.success('Meta mensal atualizada com sucesso!');
    } else {
      toast.error('Digite um valor válido para a meta');
    }
  };

  const getProgressColor = () => {
    if (goalProgress >= 100) return 'bg-green-500';
    if (goalProgress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title={`Planejamento ${accountType === 'personal' ? 'Pessoal' : 'Empresarial'}`} />
      
      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Meta Mensal */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg md:text-xl">
                <Target className="h-5 w-5 mr-2" />
                Meta Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="goal" className="text-gray-300">Valor da Meta</Label>
                  <Input
                    id="goal"
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Digite sua meta mensal"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSaveGoal}
                    className="w-full md:w-auto bg-green-primary hover:bg-green-hover text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Meta
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Progresso da Meta</span>
                  <span className="text-white">{goalProgress.toFixed(1)}%</span>
                </div>
                <Progress value={goalProgress} className={`h-3 ${getProgressColor()}`} />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Atual: {formatCurrency(monthlyBalance)}</span>
                  <span className="text-gray-400">Meta: {formatCurrency(monthlyGoal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo do Mês */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-dark-blue border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Receitas do Mês
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-green-400">
                  {formatCurrency(monthlyIncome)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-blue border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Despesas do Mês
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-red-400">
                  {formatCurrency(monthlyExpense)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-blue border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Saldo do Mês
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(monthlyBalance)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status da Meta */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg md:text-xl">Status da Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                {goalProgress >= 100 ? (
                  <div className="text-green-400">
                    <Target className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">🎉 Parabéns!</h3>
                    <p>Você atingiu sua meta mensal!</p>
                  </div>
                ) : goalProgress >= 50 ? (
                  <div className="text-yellow-400">
                    <Target className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">👍 Bem Encaminhado!</h3>
                    <p>Você está na metade do caminho para sua meta.</p>
                    <p className="text-sm mt-1">Faltam {formatCurrency(monthlyGoal - monthlyBalance)} para atingir sua meta.</p>
                  </div>
                ) : (
                  <div className="text-red-400">
                    <Target className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">💪 Continue Focado!</h3>
                    <p>Você precisa aumentar suas receitas ou diminuir gastos.</p>
                    <p className="text-sm mt-1">Faltam {formatCurrency(monthlyGoal - monthlyBalance)} para atingir sua meta.</p>
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

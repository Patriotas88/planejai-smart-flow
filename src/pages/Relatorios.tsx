
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, BarChart3, Download, Calendar, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { useExportPDF } from '@/hooks/useExportPDF';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function Relatorios() {
  const [period, setPeriod] = useState('month');
  const [isExporting, setIsExporting] = useState(false);
  
  const { transactions, isLoading } = useTransactions();
  const { formatCurrency } = useFormatCurrency();
  const { exportToPDF } = useExportPDF();
  const { accountType } = useApp();

  // Dados para gráfico de receitas vs despesas por mês
  const monthlyData = () => {
    const data: { [key: string]: { income: number; expense: number; month: string } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      if (!data[monthKey]) {
        data[monthKey] = { income: 0, expense: 0, month: monthName };
      }
      
      if (transaction.type === 'income') {
        data[monthKey].income += Number(transaction.amount);
      } else {
        data[monthKey].expense += Number(transaction.amount);
      }
    });

    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month));
  };

  // Dados para gráfico de categorias
  const categoryData = () => {
    const data: { [key: string]: { name: string; value: number; color: string } } = {};
    
    transactions.forEach(transaction => {
      if (transaction.categories) {
        const categoryName = transaction.categories.name;
        if (!data[categoryName]) {
          data[categoryName] = {
            name: categoryName,
            value: 0,
            color: transaction.categories.color
          };
        }
        data[categoryName].value += Number(transaction.amount);
      }
    });

    return Object.values(data);
  };

  const chartData = monthlyData();
  const pieData = categoryData();

  const chartConfig = {
    income: {
      label: "Receitas",
      color: "#10B981",
    },
    expense: {
      label: "Despesas", 
      color: "#EF4444",
    },
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const balance = totalIncome - totalExpense;

      await exportToPDF(totalIncome, totalExpense, balance, transactions);
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker-blue flex items-center justify-center">
        <div className="text-white">Carregando relatórios...</div>
      </div>
    );
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title={`Relatórios ${accountType === 'personal' ? 'Pessoal' : 'Empresarial'}`} />
      
      <main className="p-4 md:p-6">
        {/* Filtros */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-48 bg-dark-blue border-gray-600 text-white">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent className="bg-dark-blue border-gray-600">
                <SelectItem value="month" className="text-white">Este mês</SelectItem>
                <SelectItem value="quarter" className="text-white">Últimos 3 meses</SelectItem>
                <SelectItem value="year" className="text-white">Este ano</SelectItem>
                <SelectItem value="all" className="text-white">Todo período</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full sm:w-auto bg-green-primary hover:bg-green-hover"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Receitas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-green-400">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-red-400">
                {formatCurrency(totalExpense)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Saldo Total
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-xl md:text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Gráfico de Receitas vs Despesas */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg md:text-xl">
                <BarChart3 className="h-5 w-5 mr-2" />
                Receitas vs Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[250px] md:min-h-[300px]">
                  <RechartsBarChart data={chartData}>
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="income" fill="#10B981" name="Receitas" />
                    <Bar dataKey="expense" fill="#EF4444" name="Despesas" />
                  </RechartsBarChart>
                </ChartContainer>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Categorias */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg md:text-xl">
                <PieChart className="h-5 w-5 mr-2" />
                Gastos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="min-h-[250px] md:min-h-[300px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            return (
                              <div className="bg-gray-800 p-2 rounded border border-gray-600">
                                <p className="text-white">{payload[0].name}</p>
                                <p className="text-green-400">{formatCurrency(payload[0].value as number)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma categoria encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

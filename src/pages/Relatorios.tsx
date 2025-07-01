
import { Header } from '@/components/Header';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { addDays, format, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { useExportPDF } from '@/hooks/useExportPDF';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useFormatCurrency } from '@/hooks/useFormatCurrency';
import { toast } from 'sonner';

interface RelatoriosProps {
  onMenuClick?: () => void;
}

export default function Relatorios({ onMenuClick }: RelatoriosProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isExporting, setIsExporting] = useState(false);

  const { exportToPDF } = useExportPDF();
  const { transactions, totalIncome, totalExpense, balance, isLoading } = useTransactions();
  const { categories } = useCategories();
  const { formatCurrency } = useFormatCurrency();

  const filteredTransactions = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, {
        start: dateRange.from!,
        end: dateRange.to!
      });
    });
  }, [transactions, dateRange]);

  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = parseISO(t.date);
        return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      });

      const receitas = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const despesas = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      months.push({
        month: format(date, 'MMM', { locale: ptBR }),
        receitas,
        despesas
      });
    }
    return months;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categoryMap = new Map();
    
    filteredTransactions
      .filter(t => t.type === 'expense' && t.category_id)
      .forEach(transaction => {
        const categoryId = transaction.category_id!;
        const category = categories.find(c => c.id === categoryId);
        const categoryName = category?.name || 'Outros';
        const categoryColor = category?.color || '#6B7280';
        
        const current = categoryMap.get(categoryId) || { name: categoryName, value: 0, color: categoryColor };
        current.value += Number(transaction.amount);
        categoryMap.set(categoryId, current);
      });

    return Array.from(categoryMap.values()).slice(0, 5);
  }, [filteredTransactions, categories]);

  const trendData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = addDays(new Date(), -i);
      const dayTransactions = filteredTransactions.filter(t => {
        const transactionDate = parseISO(t.date);
        return format(transactionDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      const valor = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      last7Days.push({
        day: format(date, 'dd'),
        valor
      });
    }
    return last7Days;
  }, [filteredTransactions]);

  const stats = useMemo(() => {
    const filteredIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const filteredExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income: filteredIncome,
      expense: filteredExpense,
      balance: filteredIncome - filteredExpense,
      transactionCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    const days = parseInt(value);
    setDateRange({
      from: addDays(new Date(), -days),
      to: new Date(),
    });
  };

  const exportReport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(stats.income, stats.expense, stats.balance, filteredTransactions);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker-blue">
        <Header title="Relatórios" onMenuClick={onMenuClick} showAccountToggle />
        <main className="p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Carregando relatórios...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Relatórios" onMenuClick={onMenuClick} showAccountToggle />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Filtros */}
        <Card className="bg-dark-blue border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Filtros</CardTitle>
            <CardDescription className="text-gray-400">
              Selecione o período para visualizar os relatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Período
                </label>
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="bg-darker-blue border-gray-600 text-white">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-blue border-gray-600">
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 3 meses</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Data personalizada
                </label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                  className="bg-darker-blue border-gray-600"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={exportReport}
                  disabled={isExporting}
                  className="bg-green-primary hover:bg-green-600 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exportando...' : 'Exportar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Receitas</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.income)}</p>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Despesas</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.expense)}</p>
                </div>
                <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Saldo</p>
                  <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {formatCurrency(stats.balance)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Transações</p>
                  <p className="text-2xl font-bold text-white">{stats.transactionCount}</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Receitas vs Despesas */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Receitas vs Despesas</CardTitle>
              <CardDescription className="text-gray-400">
                Comparativo dos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                  <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Despesas por Categoria */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Despesas por Categoria</CardTitle>
              <CardDescription className="text-gray-400">
                Distribuição no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Linha - Tendência */}
        <Card className="bg-dark-blue border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Tendência de Gastos</CardTitle>
            <CardDescription className="text-gray-400">
              Evolução dos gastos nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Gastos']}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabela de Transações Recentes */}
        <Card className="bg-dark-blue border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Transações do Período</CardTitle>
            <CardDescription className="text-gray-400">
              Transações no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Data</th>
                    <th className="text-left py-3 px-4 text-gray-300">Descrição</th>
                    <th className="text-left py-3 px-4 text-gray-300">Categoria</th>
                    <th className="text-right py-3 px-4 text-gray-300">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.slice(0, 10).map((transaction) => {
                    const category = categories.find(c => c.id === transaction.category_id);
                    return (
                      <tr key={transaction.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-gray-400">
                          {format(parseISO(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="py-3 px-4 text-white">{transaction.title}</td>
                        <td className="py-3 px-4 text-gray-400">{category?.name || 'Sem categoria'}</td>
                        <td className={`py-3 px-4 text-right ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Nenhuma transação encontrada no período selecionado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

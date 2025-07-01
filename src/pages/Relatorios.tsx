import { Header } from '@/components/Header';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { useExportPDF } from '@/hooks/useExportPDF';
import { useApp } from '@/contexts/AppContext';
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
  const { transactions, getTotalIncome, getTotalExpenses, getBalance } = useApp();

  // Dados mockados para os gráficos
  const monthlyData = [
    { month: 'Jan', receitas: 4000, despesas: 2400 },
    { month: 'Fev', receitas: 3000, despesas: 1398 },
    { month: 'Mar', receitas: 2000, despesas: 9800 },
    { month: 'Abr', receitas: 2780, despesas: 3908 },
    { month: 'Mai', receitas: 1890, despesas: 4800 },
    { month: 'Jun', receitas: 2390, despesas: 3800 },
  ];

  const categoryData = [
    { name: 'Alimentação', value: 400, color: '#0088FE' },
    { name: 'Transporte', value: 300, color: '#00C49F' },
    { name: 'Lazer', value: 300, color: '#FFBB28' },
    { name: 'Saúde', value: 200, color: '#FF8042' },
    { name: 'Outros', value: 150, color: '#8884D8' },
  ];

  const trendData = [
    { day: '1', valor: 1200 },
    { day: '2', valor: 1900 },
    { day: '3', valor: 800 },
    { day: '4', valor: 1500 },
    { day: '5', valor: 2000 },
    { day: '6', valor: 1700 },
    { day: '7', valor: 1400 },
  ];

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
      const totalIncome = getTotalIncome();
      const totalExpenses = getTotalExpenses();
      const balance = getBalance();
      
      await exportToPDF(totalIncome, totalExpenses, balance, transactions);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Relatórios" onMenuClick={onMenuClick} />
      
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
                  <p className="text-2xl font-bold text-green-400">R$ 15.240</p>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">+12% em relação ao período anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Despesas</p>
                  <p className="text-2xl font-bold text-red-400">R$ 8.750</p>
                </div>
                <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">-5% em relação ao período anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Saldo</p>
                  <p className="text-2xl font-bold text-blue-400">R$ 6.490</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">+25% em relação ao período anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Transações</p>
                  <p className="text-2xl font-bold text-white">142</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">+8 transações este mês</p>
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
                Comparativo mensal
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
                  />
                  <Bar dataKey="receitas" fill="#10B981" />
                  <Bar dataKey="despesas" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Despesas por Categoria */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Despesas por Categoria</CardTitle>
              <CardDescription className="text-gray-400">
                Distribuição das despesas
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
            <CardTitle className="text-white">Transações Recentes</CardTitle>
            <CardDescription className="text-gray-400">
              Últimas movimentações financeiras
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
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-400">
                      {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="py-3 px-4 text-white">Supermercado</td>
                    <td className="py-3 px-4 text-gray-400">Alimentação</td>
                    <td className="py-3 px-4 text-right text-red-400">-R$ 150,00</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-400">
                      {format(addDays(new Date(), -1), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="py-3 px-4 text-white">Salário</td>
                    <td className="py-3 px-4 text-gray-400">Receita</td>
                    <td className="py-3 px-4 text-right text-green-400">+R$ 3.500,00</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-400">
                      {format(addDays(new Date(), -2), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="py-3 px-4 text-white">Combustível</td>
                    <td className="py-3 px-4 text-gray-400">Transporte</td>
                    <td className="py-3 px-4 text-right text-red-400">-R$ 80,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

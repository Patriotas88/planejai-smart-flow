
import { Header } from '@/components/Header';
import { FinanceCard } from '@/components/FinanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Calendar, Plus } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Dashboard Financeiro" showUserToggle={true} />
      
      <main className="p-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinanceCard
            title="Receitas"
            value="R$ 8.450,00"
            type="income"
            icon={<ArrowUp className="h-4 w-4" />}
          />
          <FinanceCard
            title="Despesas"
            value="R$ 3.200,00"
            type="expense"
            icon={<ArrowDown className="h-4 w-4" />}
          />
          <FinanceCard
            title="Saldo Atual"
            value="R$ 5.250,00"
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
                <Button size="sm" className="bg-green-primary hover:bg-green-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { desc: 'Supermercado Extra', value: '-R$ 250,00', date: '15/01/2024', type: 'expense' },
                  { desc: 'Salário Empresa', value: '+R$ 4.500,00', date: '10/01/2024', type: 'income' },
                  { desc: 'Conta de Luz', value: '-R$ 180,00', date: '05/01/2024', type: 'expense' },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div>
                      <p className="text-white font-medium">{transaction.desc}</p>
                      <p className="text-gray-400 text-sm">{transaction.date}</p>
                    </div>
                    <span className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categorias Mais Gastas */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Categorias Mais Gastas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'Alimentação', value: 'R$ 850,00', percentage: 65 },
                  { category: 'Transporte', value: 'R$ 420,00', percentage: 32 },
                  { category: 'Lazer', value: 'R$ 180,00', percentage: 14 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white">{item.category}</span>
                      <span className="text-gray-400">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="bg-dark-blue border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="bg-green-primary hover:bg-green-hover text-white flex flex-col items-center p-6 h-auto">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm">Nova Receita</span>
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white flex flex-col items-center p-6 h-auto">
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
      </main>
    </div>
  );
}


import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';

export default function Categorias() {
  const categories = [
    { name: 'Alimentação', color: 'bg-green-500', transactions: 15 },
    { name: 'Transporte', color: 'bg-blue-500', transactions: 8 },
    { name: 'Lazer', color: 'bg-purple-500', transactions: 5 },
    { name: 'Contas', color: 'bg-red-500', transactions: 12 },
    { name: 'Saúde', color: 'bg-yellow-500', transactions: 3 },
  ];

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Categorias" />
      
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Suas Categorias</h2>
          <Button className="bg-green-primary hover:bg-green-hover">
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="bg-dark-blue border-gray-700 hover:border-green-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <div className={`w-4 h-4 rounded-full ${category.color} mr-3`} />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{category.transactions} transações</span>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

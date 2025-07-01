
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Calendar } from 'lucide-react';

export default function Relatorios() {
  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Relatórios" />
      
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Relatório Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Janeiro 2024</span>
                  <Button size="sm" variant="outline" className="border-gray-600">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
                <div className="text-center py-8">
                  <div className="w-32 h-32 mx-auto bg-green-primary/20 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-16 w-16 text-green-primary" />
                  </div>
                  <p className="text-gray-400">Gráficos e relatórios detalhados em desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Relatórios Personalizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">Crie relatórios customizados por período e categoria</p>
                <Button className="w-full bg-green-primary hover:bg-green-hover">
                  Criar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

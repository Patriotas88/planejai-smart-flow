
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Calendar } from 'lucide-react';

export default function Perfil() {
  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Meu Perfil" />
      
      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-green-primary rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Wesley Inácio</h3>
                  <p className="text-gray-400">wesley.inacio88@gmail.com</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Nome Completo
                  </label>
                  <Input
                    defaultValue="Wesley Inácio"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Email
                  </label>
                  <Input
                    defaultValue="wesley.inacio88@gmail.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Configurações de Integração
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h5 className="text-white font-medium mb-2">WhatsApp + n8n</h5>
                    <p className="text-gray-400 text-sm mb-3">
                      Configure a integração para lançar gastos via WhatsApp automaticamente
                    </p>
                    <Button variant="outline" className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white">
                      Configurar Integração
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  Cancelar
                </Button>
                <Button className="bg-green-primary hover:bg-green-hover">
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

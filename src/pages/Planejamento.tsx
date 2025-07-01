import { Header } from '@/components/Header';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Target, TrendingUp, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlanejamentoProps {
  onMenuClick?: () => void;
}

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  valorAtual: number;
  categoria: string;
  prazo: string;
  status: 'ativa' | 'concluida' | 'pausada';
}

interface Orcamento {
  id: string;
  categoria: string;
  valorPlanejado: number;
  valorGasto: number;
  periodo: string;
}

export default function Planejamento({ onMenuClick }: PlanejamentoProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('metas');
  
  // Estados para Metas
  const [metas, setMetas] = useState<Meta[]>([
    {
      id: '1',
      titulo: 'Reserva de Emergência',
      descricao: 'Juntar 6 meses de gastos para emergências',
      valor: 30000,
      valorAtual: 15000,
      categoria: 'Reserva',
      prazo: '2024-12-31',
      status: 'ativa'
    },
    {
      id: '2',
      titulo: 'Viagem para Europa',
      descricao: 'Economizar para viagem de férias',
      valor: 15000,
      valorAtual: 8500,
      categoria: 'Lazer',
      prazo: '2024-07-15',
      status: 'ativa'
    }
  ]);

  // Estados para Orçamentos
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([
    {
      id: '1',
      categoria: 'Alimentação',
      valorPlanejado: 1200,
      valorGasto: 950,
      periodo: 'Mensal'
    },
    {
      id: '2',
      categoria: 'Transporte',
      valorPlanejado: 800,
      valorGasto: 720,
      periodo: 'Mensal'
    },
    {
      id: '3',
      categoria: 'Lazer',
      valorPlanejado: 500,
      valorGasto: 380,
      periodo: 'Mensal'
    }
  ]);

  // Estados para formulários
  const [novaMeta, setNovaMeta] = useState({
    titulo: '',
    descricao: '',
    valor: '',
    categoria: '',
    prazo: ''
  });

  const [novoOrcamento, setNovoOrcamento] = useState({
    categoria: '',
    valorPlanejado: '',
    periodo: 'Mensal'
  });

  const [showFormMeta, setShowFormMeta] = useState(false);
  const [showFormOrcamento, setShowFormOrcamento] = useState(false);

  // Funções para Metas
  const handleAddMeta = () => {
    if (!novaMeta.titulo || !novaMeta.valor || !novaMeta.categoria || !novaMeta.prazo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const meta: Meta = {
      id: Date.now().toString(),
      titulo: novaMeta.titulo,
      descricao: novaMeta.descricao,
      valor: parseFloat(novaMeta.valor),
      valorAtual: 0,
      categoria: novaMeta.categoria,
      prazo: novaMeta.prazo,
      status: 'ativa'
    };

    setMetas([...metas, meta]);
    setNovaMeta({ titulo: '', descricao: '', valor: '', categoria: '', prazo: '' });
    setShowFormMeta(false);
    
    toast({
      title: "Meta criada!",
      description: "Sua nova meta foi adicionada com sucesso."
    });
  };

  const handleDeleteMeta = (id: string) => {
    setMetas(metas.filter(meta => meta.id !== id));
    toast({
      title: "Meta removida",
      description: "A meta foi removida com sucesso."
    });
  };

  // Funções para Orçamentos
  const handleAddOrcamento = () => {
    if (!novoOrcamento.categoria || !novoOrcamento.valorPlanejado) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const orcamento: Orcamento = {
      id: Date.now().toString(),
      categoria: novoOrcamento.categoria,
      valorPlanejado: parseFloat(novoOrcamento.valorPlanejado),
      valorGasto: 0,
      periodo: novoOrcamento.periodo
    };

    setOrcamentos([...orcamentos, orcamento]);
    setNovoOrcamento({ categoria: '', valorPlanejado: '', periodo: 'Mensal' });
    setShowFormOrcamento(false);
    
    toast({
      title: "Orçamento criado!",
      description: "Seu novo orçamento foi adicionado com sucesso."
    });
  };

  const handleDeleteOrcamento = (id: string) => {
    setOrcamentos(orcamentos.filter(orc => orc.id !== id));
    toast({
      title: "Orçamento removido",
      description: "O orçamento foi removido com sucesso."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-500';
      case 'concluida': return 'bg-blue-500';
      case 'pausada': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Planejamento" onMenuClick={onMenuClick} />
      
      <main className="p-4 md:p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-dark-blue">
            <TabsTrigger value="metas" className="data-[state=active]:bg-green-primary">
              <Target className="w-4 h-4 mr-2" />
              Metas
            </TabsTrigger>
            <TabsTrigger value="orcamentos" className="data-[state=active]:bg-green-primary">
              <DollarSign className="w-4 h-4 mr-2" />
              Orçamentos
            </TabsTrigger>
          </TabsList>

          {/* Tab de Metas */}
          <TabsContent value="metas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Minhas Metas</h2>
              <Button 
                onClick={() => setShowFormMeta(!showFormMeta)}
                className="bg-green-primary hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Meta
              </Button>
            </div>

            {/* Formulário Nova Meta */}
            {showFormMeta && (
              <Card className="bg-dark-blue border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Criar Nova Meta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="titulo" className="text-gray-300">Título *</Label>
                      <Input
                        id="titulo"
                        value={novaMeta.titulo}
                        onChange={(e) => setNovaMeta({...novaMeta, titulo: e.target.value})}
                        className="bg-darker-blue border-gray-600 text-white"
                        placeholder="Ex: Reserva de emergência"
                      />
                    </div>
                    <div>
                      <Label htmlFor="valor" className="text-gray-300">Valor Meta (R$) *</Label>
                      <Input
                        id="valor"
                        type="number"
                        value={novaMeta.valor}
                        onChange={(e) => setNovaMeta({...novaMeta, valor: e.target.value})}
                        className="bg-darker-blue border-gray-600 text-white"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao" className="text-gray-300">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={novaMeta.descricao}
                      onChange={(e) => setNovaMeta({...novaMeta, descricao: e.target.value})}
                      className="bg-darker-blue border-gray-600 text-white"
                      placeholder="Descreva sua meta..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoria" className="text-gray-300">Categoria *</Label>
                      <Select value={novaMeta.categoria} onValueChange={(value) => setNovaMeta({...novaMeta, categoria: value})}>
                        <SelectTrigger className="bg-darker-blue border-gray-600 text-white">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Reserva">Reserva</SelectItem>
                          <SelectItem value="Investimento">Investimento</SelectItem>
                          <SelectItem value="Lazer">Lazer</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Veículo">Veículo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="prazo" className="text-gray-300">Prazo *</Label>
                      <Input
                        id="prazo"
                        type="date"
                        value={novaMeta.prazo}
                        onChange={(e) => setNovaMeta({...novaMeta, prazo: e.target.value})}
                        className="bg-darker-blue border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddMeta} className="bg-green-primary hover:bg-green-600">
                      Criar Meta
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFormMeta(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Metas */}
            <div className="grid gap-4">
              {metas.map((meta) => {
                const progresso = (meta.valorAtual / meta.valor) * 100;
                return (
                  <Card key={meta.id} className="bg-dark-blue border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            {meta.titulo}
                            <Badge className={`${getStatusColor(meta.status)} text-white`}>
                              {meta.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {meta.descricao}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDeleteMeta(meta.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-white">{progresso.toFixed(1)}%</span>
                        </div>
                        <Progress value={progresso} className="h-2" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block">Valor Atual</span>
                            <span className="text-green-400 font-semibold">
                              R$ {meta.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Meta</span>
                            <span className="text-white font-semibold">
                              R$ {meta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Categoria</span>
                            <span className="text-white">{meta.categoria}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Prazo</span>
                            <span className="text-white">
                              {new Date(meta.prazo).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Tab de Orçamentos */}
          <TabsContent value="orcamentos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Meus Orçamentos</h2>
              <Button 
                onClick={() => setShowFormOrcamento(!showFormOrcamento)}
                className="bg-green-primary hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Orçamento
              </Button>
            </div>

            {/* Formulário Novo Orçamento */}
            {showFormOrcamento && (
              <Card className="bg-dark-blue border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Criar Novo Orçamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="categoria-orc" className="text-gray-300">Categoria *</Label>
                      <Select value={novoOrcamento.categoria} onValueChange={(value) => setNovoOrcamento({...novoOrcamento, categoria: value})}>
                        <SelectTrigger className="bg-darker-blue border-gray-600 text-white">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Lazer">Lazer</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Roupas">Roupas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="valor-planejado" className="text-gray-300">Valor Planejado (R$) *</Label>
                      <Input
                        id="valor-planejado"
                        type="number"
                        value={novoOrcamento.valorPlanejado}
                        onChange={(e) => setNovoOrcamento({...novoOrcamento, valorPlanejado: e.target.value})}
                        className="bg-darker-blue border-gray-600 text-white"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="periodo" className="text-gray-300">Período</Label>
                      <Select value={novoOrcamento.periodo} onValueChange={(value) => setNovoOrcamento({...novoOrcamento, periodo: value})}>
                        <SelectTrigger className="bg-darker-blue border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Mensal">Mensal</SelectItem>
                          <SelectItem value="Trimestral">Trimestral</SelectItem>
                          <SelectItem value="Anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddOrcamento} className="bg-green-primary hover:bg-green-600">
                      Criar Orçamento
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFormOrcamento(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Orçamentos */}
            <div className="grid gap-4">
              {orcamentos.map((orcamento) => {
                const percentualGasto = (orcamento.valorGasto / orcamento.valorPlanejado) * 100;
                const restante = orcamento.valorPlanejado - orcamento.valorGasto;
                
                return (
                  <Card key={orcamento.id} className="bg-dark-blue border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{orcamento.categoria}</CardTitle>
                          <CardDescription className="text-gray-400">
                            Período: {orcamento.periodo}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDeleteOrcamento(orcamento.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Utilizado</span>
                          <span className="text-white">{percentualGasto.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={percentualGasto} 
                          className={`h-2 ${getProgressColor(percentualGasto)}`}
                        />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block">Planejado</span>
                            <span className="text-white font-semibold">
                              R$ {orcamento.valorPlanejado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Gasto</span>
                            <span className="text-red-400 font-semibold">
                              R$ {orcamento.valorGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Restante</span>
                            <span className={`font-semibold ${restante >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              R$ {Math.abs(restante).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Status</span>
                            <Badge className={`${percentualGasto > 100 ? 'bg-red-500' : percentualGasto > 80 ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                              {percentualGasto > 100 ? 'Excedido' : percentualGasto > 80 ? 'Atenção' : 'Normal'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

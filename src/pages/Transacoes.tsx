
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  PlusCircle, 
  Search, 
  Edit,
  Trash2,
  Filter,
  Download
} from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/utils';
import { TransactionModal } from '@/components/TransactionModal';

interface TransacoesProps {
  onMenuClick?: () => void;
}

export default function Transacoes({ onMenuClick }: TransacoesProps) {
  const { 
    transactions, 
    deleteTransaction,
    isLoading 
  } = useTransactions();
  const { categories } = useCategories();

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category_id === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    if (transaction.type === 'income') {
      setShowIncomeModal(true);
    } else {
      setShowExpenseModal(true);
    }
  };

  const handleDelete = async (transactionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(transactionId);
    }
  };

  const handleCloseModal = () => {
    setShowIncomeModal(false);
    setShowExpenseModal(false);
    setEditingTransaction(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker-blue">
        <Header title="Transações" onMenuClick={onMenuClick} />
        <main className="p-4 md:p-6">
          <div className="text-center text-white">Carregando transações...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Transações" onMenuClick={onMenuClick} />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-dark-blue border-gray-700 text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 bg-dark-blue border-gray-700 text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-dark-blue border-gray-700 text-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="bg-green-primary hover:bg-green-600 text-white"
              onClick={() => setShowIncomeModal(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Receita
            </Button>
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => setShowExpenseModal(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <Card className="bg-dark-blue border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Todas as Transações</span>
              <Badge variant="secondary" className="text-sm">
                {filteredTransactions.length} transações
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Descrição</TableHead>
                    <TableHead className="text-gray-300">Categoria</TableHead>
                    <TableHead className="text-gray-300">Tipo</TableHead>
                    <TableHead className="text-gray-300 text-right">Valor</TableHead>
                    <TableHead className="text-gray-300 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => {
                      const category = categories.find(c => c.id === transaction.category_id);
                      return (
                        <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell className="text-gray-300">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">{transaction.title}</p>
                              {transaction.description && (
                                <p className="text-sm text-gray-400">{transaction.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {category ? (
                              <Badge 
                                style={{ backgroundColor: category.color + '20', color: category.color }}
                                className="border-0"
                              >
                                {category.name}
                              </Badge>
                            ) : (
                              <span className="text-gray-500">Sem categoria</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.type === 'income' ? 'default' : 'destructive'}
                              className={transaction.type === 'income' ? 'bg-green-500' : ''}
                            >
                              {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-bold ${
                            transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(Number(transaction.amount))}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(transaction)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(transaction.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        Nenhuma transação encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Transaction Modals */}
      <TransactionModal
        open={showIncomeModal}
        onClose={handleCloseModal}
        type="income"
        transaction={editingTransaction?.type === 'income' ? editingTransaction : undefined}
      />
      
      <TransactionModal
        open={showExpenseModal}
        onClose={handleCloseModal}
        type="expense"
        transaction={editingTransaction?.type === 'expense' ? editingTransaction : undefined}
      />
    </div>
  );
}

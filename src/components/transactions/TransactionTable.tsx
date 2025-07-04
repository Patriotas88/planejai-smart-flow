
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { formatDateToBrazilian } from '@/lib/dateUtils';
import { useCategories } from '@/hooks/useCategories';
import { Transaction } from '@/hooks/useTransactions';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const { categories } = useCategories();

  return (
    <Card className="bg-dark-blue border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Todas as Transações</span>
          <Badge variant="secondary" className="text-sm">
            {transactions.length} transações
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
              {transactions.length > 0 ? (
                transactions.map((transaction) => {
                  const category = categories.find(c => c.id === transaction.category_id);
                  return (
                    <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell className="text-gray-300">
                        {formatDateToBrazilian(transaction.date)}
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
                            onClick={() => onEdit(transaction)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(transaction.id)}
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
  );
}

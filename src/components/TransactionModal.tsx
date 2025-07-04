import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/hooks/useCurrency';
import { useCategories } from '@/hooks/useCategories';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { getCurrentLocalDate } from '@/lib/dateUtils';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  transaction?: Transaction;
}

export function TransactionModal({ open, onClose, type, transaction }: TransactionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(getCurrentLocalDate());
  
  const { displayValue, numericValue, handleChange, setValue } = useCurrency();
  const { categories } = useCategories();
  const { addTransaction, updateTransaction, deleteTransaction, isAddingTransaction, isUpdatingTransaction, isDeletingTransaction } = useTransactions();
  const { accountType } = useApp();

  const isEditing = !!transaction;
  const isLoading = isAddingTransaction || isUpdatingTransaction || isDeletingTransaction;

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setDescription(transaction.description || '');
      setCategoryId(transaction.category_id || '');
      setDate(transaction.date);
      setValue(transaction.amount);
    } else {
      // Reset form when not editing
      setTitle('');
      setDescription('');
      setCategoryId('');
      setDate(getCurrentLocalDate());
      handleChange('');
    }
  }, [transaction, setValue, handleChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || numericValue <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (isEditing) {
        await updateTransaction({
          id: transaction.id,
          title,
          amount: numericValue,
          type,
          account_type: accountType,
          description: description || undefined,
          category_id: categoryId || undefined,
          date
        });
        toast.success('Transação atualizada com sucesso!');
      } else {
        await addTransaction({
          title,
          amount: numericValue,
          type,
          account_type: accountType,
          description: description || undefined,
          category_id: categoryId || undefined,
          date
        });
        toast.success(`${type === 'income' ? 'Receita' : 'Despesa'} adicionada com sucesso!`);
      }

      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar transação' : 'Erro ao adicionar transação');
      console.error('Error with transaction:', error);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(transaction.id);
        toast.success('Transação excluída com sucesso!');
        onClose();
      } catch (error) {
        toast.error('Erro ao excluir transação');
        console.error('Error deleting transaction:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-dark-blue border-gray-700 text-white max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg md:text-xl">
            {isEditing ? 'Editar' : 'Nova'} {type === 'income' ? 'Receita' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-gray-300">Valor *</Label>
            <Input
              id="amount"
              value={displayValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="R$ 0,00"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-300">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-white">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="text-gray-300">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 order-3 sm:order-1"
              >
                {isDeletingTransaction ? 'Excluindo...' : 'Excluir'}
              </Button>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 order-1 sm:order-2"
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
              className={`flex-1 order-2 sm:order-3 ${
                type === 'income' 
                  ? 'bg-green-primary hover:bg-green-hover' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

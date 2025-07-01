
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/hooks/useCurrency';
import { useCategories } from '@/hooks/useCategories';
import { useTransactions } from '@/hooks/useTransactions';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
}

export function TransactionModal({ open, onClose, type }: TransactionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { displayValue, numericValue, handleChange } = useCurrency();
  const { categories } = useCategories();
  const { addTransaction, isAddingTransaction } = useTransactions();
  const { accountType } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || numericValue <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
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
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategoryId('');
      setDate(new Date().toISOString().split('T')[0]);
      handleChange('');
      
      onClose();
    } catch (error) {
      toast.error('Erro ao adicionar transação');
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-dark-blue border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            Nova {type === 'income' ? 'Receita' : 'Despesa'}
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
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
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
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-300">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
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
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isAddingTransaction}
              className={`flex-1 ${
                type === 'income' 
                  ? 'bg-green-primary hover:bg-green-hover' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {isAddingTransaction ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

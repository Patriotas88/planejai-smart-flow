
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function TransactionActions({ onAddIncome, onAddExpense }: TransactionActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        className="bg-green-primary hover:bg-green-600 text-white"
        onClick={onAddIncome}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Nova Receita
      </Button>
      <Button 
        variant="outline" 
        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        onClick={onAddExpense}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Nova Despesa
      </Button>
    </div>
  );
}

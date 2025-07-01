
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinanceCardProps {
  title: string;
  value: string;
  type: 'income' | 'expense' | 'balance';
  icon?: React.ReactNode;
}

export function FinanceCard({ title, value, type, icon }: FinanceCardProps) {
  const getCardStyles = () => {
    switch (type) {
      case 'income':
        return 'border-green-500 bg-green-500/10';
      case 'expense':
        return 'border-red-500 bg-red-500/10';
      case 'balance':
        return 'border-blue-500 bg-blue-500/10';
      default:
        return 'border-gray-700 bg-gray-800/50';
    }
  };

  const getValueStyles = () => {
    switch (type) {
      case 'income':
        return 'text-green-400';
      case 'expense':
        return 'text-red-400';
      case 'balance':
        return 'text-blue-400';
      default:
        return 'text-white';
    }
  };

  return (
    <Card className={`${getCardStyles()} transition-all hover:scale-105`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getValueStyles()}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

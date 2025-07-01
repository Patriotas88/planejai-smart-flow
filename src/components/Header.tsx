
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface HeaderProps {
  title: string;
  showUserToggle?: boolean;
}

export function Header({ title, showUserToggle = false }: HeaderProps) {
  return (
    <header className="bg-dark-blue border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        
        {showUserToggle && (
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="bg-green-primary hover:bg-green-hover text-white border-green-primary"
            >
              <User className="h-4 w-4 mr-2" />
              Pessoais
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Empresariais
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}


import { Button } from '@/components/ui/button';
import { User, Building2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export function AccountTypeToggle() {
  const { accountType, setAccountType } = useApp();
  const { toast } = useToast();

  const handleToggle = (type: 'personal' | 'business') => {
    if (type !== accountType) {
      setAccountType(type);
      toast({
        title: "Perfil alterado",
        description: `Mudou para perfil ${type === 'personal' ? 'Pessoal' : 'Empresarial'}`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={accountType === 'personal' ? 'default' : 'outline'}
        onClick={() => handleToggle('personal')}
        className={accountType === 'personal' 
          ? 'bg-green-primary hover:bg-green-hover text-white' 
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
        }
        size="sm"
      >
        <User className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Pessoal</span>
      </Button>
      <Button
        variant={accountType === 'business' ? 'default' : 'outline'}
        onClick={() => handleToggle('business')}
        className={accountType === 'business' 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
        }
        size="sm"
      >
        <Building2 className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Empresarial</span>
      </Button>
    </div>
  );
}


import { Button } from '@/components/ui/button';
import { User, Building2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function AccountTypeToggle() {
  const { accountType, setAccountType } = useApp();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={accountType === 'personal' ? 'default' : 'outline'}
        onClick={() => setAccountType('personal')}
        className={accountType === 'personal' 
          ? 'bg-green-primary hover:bg-green-hover text-white' 
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
        }
      >
        <User className="h-4 w-4 mr-2" />
        Pessoal
      </Button>
      <Button
        variant={accountType === 'business' ? 'default' : 'outline'}
        onClick={() => setAccountType('business')}
        className={accountType === 'business' 
          ? 'bg-green-primary hover:bg-green-hover text-white' 
          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
        }
      >
        <Building2 className="h-4 w-4 mr-2" />
        Empresarial
      </Button>
    </div>
  );
}


import { User, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

export function AccountTypeIndicator() {
  const { accountType } = useApp();

  return (
    <div className="flex items-center gap-2">
      {accountType === 'personal' ? (
        <>
          <User className="h-4 w-4 text-green-primary" />
          <Badge className="bg-green-primary/20 text-green-primary border-green-primary/30">
            Perfil Pessoal
          </Badge>
        </>
      ) : (
        <>
          <Building2 className="h-4 w-4 text-blue-500" />
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
            Perfil Empresarial
          </Badge>
        </>
      )}
    </div>
  );
}

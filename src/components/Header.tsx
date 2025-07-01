
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBackButton } from '@/hooks/useBackButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { AccountTypeToggle } from '@/components/AccountTypeToggle';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  showAccountToggle?: boolean;
}

export function Header({ title, onMenuClick, showAccountToggle = false }: HeaderProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { canGoBack, goBack } = useBackButton();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-dark-blue border-b border-gray-700 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Botão Menu para Mobile */}
          {isMobile && onMenuClick && (
            <Button
              onClick={onMenuClick}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700 mobile-button"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* Botão Voltar */}
          {canGoBack && (
            <Button
              onClick={goBack}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700 mobile-button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <h1 className="text-xl md:text-2xl font-bold text-white truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle de Tipo de Conta */}
          {showAccountToggle && <AccountTypeToggle />}
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 mobile-button"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

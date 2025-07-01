
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  User, 
  Calendar,
  LogOut,
  ChevronDown,
  ChevronUp,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { 
    title: 'Dashboard', 
    path: '/dashboard', 
    icon: BarChart3,
    active: true 
  },
  { 
    title: 'Planejamento', 
    path: '/planejamento', 
    icon: Target 
  },
  { 
    title: 'Relatórios', 
    path: '/relatorios', 
    icon: BarChart3 
  },
  { 
    title: 'Categorias', 
    path: '/categorias', 
    icon: Calendar 
  },
  { 
    title: 'Meu Perfil', 
    path: '/perfil', 
    icon: User 
  }
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Fecha a sidebar mobile quando navegar
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className={`bg-dark-blue border-r border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 safe-area-top">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-white">Planejai</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 mobile-button ${
                    isActive 
                      ? 'bg-green-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">{item.title}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 safe-area-bottom">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start text-gray-300 hover:text-white hover:bg-gray-700 mobile-button"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 text-sm">Sair</span>}
        </Button>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleMenuClick = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const closeMobileSidebar = () => {
    setShowMobileSidebar(false);
  };

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-darker-blue overflow-x-hidden">
      {/* Sidebar Desktop */}
      {!isMobile && <Sidebar />}
      
      {/* Sidebar Mobile com Overlay */}
      {isMobile && showMobileSidebar && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileSidebar}
          />
          {/* Sidebar Mobile */}
          <div className="fixed left-0 top-0 h-full z-50 w-64">
            <Sidebar onNavigate={closeMobileSidebar} />
          </div>
        </>
      )}
      
      <div className={`flex-1 ${isMobile ? 'w-full' : ''} overflow-x-hidden`}>
        {/* Passar a função de menu para o Header via context ou props */}
        {React.cloneElement(children as React.ReactElement, { 
          onMenuClick: isMobile ? handleMenuClick : undefined 
        })}
      </div>
    </div>
  );
}

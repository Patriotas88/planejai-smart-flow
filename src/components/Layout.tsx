
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-darker-blue overflow-x-hidden">
      {!isMobile && <Sidebar />}
      <div className={`flex-1 ${isMobile ? 'w-full' : ''} overflow-x-hidden`}>
        {children}
      </div>
    </div>
  );
}

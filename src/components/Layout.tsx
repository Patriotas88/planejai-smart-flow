
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-darker-blue">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

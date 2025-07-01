import { Header } from '@/components/Header';

interface CategoriasProps {
  onMenuClick?: () => void;
}

export default function Categorias({ onMenuClick }: CategoriasProps) {
  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Categorias" onMenuClick={onMenuClick} />
      
      <main className="p-4 md:p-6 space-y-6">
        
      </main>
    </div>
  );
}

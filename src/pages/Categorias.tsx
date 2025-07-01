
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryModal } from '@/components/CategoryModal';
import { useCategories, Category } from '@/hooks/useCategories';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CategoriasProps {
  onMenuClick?: () => void;
}

export default function Categorias({ onMenuClick }: CategoriasProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { categories, isLoading, deleteCategory, isDeletingCategory } = useCategories();
  const { toast } = useToast();

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      deleteCategory(category.id);
      toast({
        title: "Categoria excluída",
        description: `${category.name} foi excluída com sucesso!`
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker-blue">
        <Header title="Categorias" onMenuClick={onMenuClick} showAccountToggle />
        <main className="p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Carregando categorias...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Categorias" onMenuClick={onMenuClick} showAccountToggle />
      
      <main className="p-4 md:p-6 space-y-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl text-white font-semibold">Gerencie suas Categorias</h2>
            <p className="text-gray-400">Organize suas transações por categorias personalizadas</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-primary hover:bg-green-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {/* Lista de Categorias */}
        {categories.length === 0 ? (
          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-8 text-center">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-400 mb-4">
                Crie sua primeira categoria para organizar suas transações
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-primary hover:bg-green-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Categoria
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="bg-dark-blue border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-white text-base">{category.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-400 hover:text-white p-1 h-auto"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="text-gray-400 hover:text-red-400 p-1 h-auto"
                        disabled={isDeletingCategory}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Tipo: {category.type === 'personal' ? 'Pessoal' : 'Empresarial'}
                    </span>
                    <span className="text-gray-500">
                      {new Date(category.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          category={editingCategory}
        />
      </main>
    </div>
  );
}

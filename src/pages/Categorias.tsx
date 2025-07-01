
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Palette } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

const colorOptions = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#84CC16', '#6366F1', '#A855F7', '#06B6D4'
];

export default function Categorias() {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory } = useCategories();
  const { accountType } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#10B981');

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setName(category?.name || '');
    setColor(category?.color || '#10B981');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setName('');
    setColor('#10B981');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          name: name.trim(),
          color
        });
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await addCategory({
          name: name.trim(),
          color,
          type: accountType
        });
        toast.success('Categoria criada com sucesso!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Erro ao salvar categoria');
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId);
        toast.success('Categoria excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir categoria');
        console.error('Error deleting category:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker-blue">
        <Header title="Categorias" />
        <main className="p-6">
          <div className="text-white text-center">Carregando categorias...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title={`Categorias ${accountType === 'personal' ? 'Pessoais' : 'Empresariais'}`} />
      
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Suas Categorias</h2>
          <Button 
            className="bg-green-primary hover:bg-green-hover"
            onClick={() => handleOpenModal()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {categories.length === 0 ? (
          <Card className="bg-dark-blue border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Palette className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Nenhuma categoria encontrada</p>
                <p className="text-sm">Crie sua primeira categoria para organizar suas transações</p>
              </div>
              <Button 
                className="bg-green-primary hover:bg-green-hover mt-4"
                onClick={() => handleOpenModal()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="bg-dark-blue border-gray-700 hover:border-green-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: category.color }} 
                      />
                      {category.name}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenModal(category)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-400 text-sm">
                    Categoria {category.type === 'personal' ? 'Pessoal' : 'Empresarial'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="bg-dark-blue border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome da categoria"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Cor</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption}
                      type="button"
                      onClick={() => setColor(colorOption)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        color === colorOption ? 'border-white' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: colorOption }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-primary hover:bg-green-hover text-white"
                >
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

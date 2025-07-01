
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCategories, Category } from '@/hooks/useCategories';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { X, User, Building2 } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

const defaultColors = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
];

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#10B981');
  const { addCategory, updateCategory, isAddingCategory, isUpdatingCategory } = useCategories();
  const { accountType } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedColor(category.color);
    } else {
      setName('');
      setSelectedColor('#10B981');
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const categoryData = {
      name: name.trim(),
      color: selectedColor,
      type: accountType // Usar o accountType atual em vez de hardcoded 'personal'
    };

    const profileText = accountType === 'personal' ? 'pessoal' : 'empresarial';

    if (category) {
      updateCategory({ id: category.id, ...categoryData });
    } else {
      addCategory(categoryData);
    }

    toast({
      title: category ? "Categoria atualizada" : "Categoria criada",
      description: `${name} foi ${category ? 'atualizada' : 'criada'} no perfil ${profileText}!`
    });

    onClose();
  };

  const isLoading = isAddingCategory || isUpdatingCategory;
  const profileText = accountType === 'personal' ? 'Pessoal' : 'Empresarial';
  const ProfileIcon = accountType === 'personal' ? User : Building2;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-blue border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              {category ? 'Editar Categoria' : 'Nova Categoria'}
              <Badge 
                variant="outline" 
                className={`${
                  accountType === 'personal' 
                    ? 'border-green-500 text-green-400' 
                    : 'border-blue-500 text-blue-400'
                } bg-transparent`}
              >
                <ProfileIcon className="h-3 w-3 mr-1" />
                {profileText}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-darker-blue p-3 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300">
              Esta categoria será criada no perfil <strong className={accountType === 'personal' ? 'text-green-400' : 'text-blue-400'}>{profileText}</strong>
            </p>
          </div>

          <div>
            <Label htmlFor="name" className="text-gray-300">
              Nome da Categoria
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alimentação, Transporte..."
              className="bg-darker-blue border-gray-600 text-white"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label className="text-gray-300 mb-3 block">
              Cor da Categoria
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-white scale-110' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`flex-1 text-white ${
                accountType === 'personal' 
                  ? 'bg-green-primary hover:bg-green-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Salvando...' : (category ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

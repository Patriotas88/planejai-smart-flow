
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'personal' | 'business';
}

export function useCategories() {
  const { user } = useAuth();
  const { accountType } = useApp();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', user?.id, accountType],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', accountType)
        .order('name');

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user
  });

  return {
    categories,
    isLoading
  };
}

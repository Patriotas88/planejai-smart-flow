
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Save, Mail, Calendar } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Perfil() {
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfile, isUpdatingProfile } = useProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Debug logs
  console.log('Profile data:', { profile, user, isLoading });

  useEffect(() => {
    if (profile) {
      console.log('Setting profile data:', profile);
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
    } else if (user && !isLoading) {
      // Fallback para dados do usuário se o perfil não existir
      console.log('Using user data as fallback:', user);
      setEmail(user.email || '');
    }
  }, [profile, user, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        full_name: fullName.trim(),
        email: email.trim()
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      try {
        await signOut();
        toast.success('Logout realizado com sucesso!');
      } catch (error) {
        toast.error('Erro ao fazer logout');
        console.error('Error signing out:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-darker-blue overflow-x-hidden">
        <Header title="Meu Perfil" />
        <main className="p-3 sm:p-4 md:p-6 safe-area-bottom">
          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="bg-dark-blue border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full bg-gray-700" />
                <Skeleton className="h-10 w-full bg-gray-700" />
                <Skeleton className="h-10 w-32 bg-gray-700" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-darker-blue overflow-x-hidden">
      <Header title="Meu Perfil" />
      
      <main className="p-3 sm:p-4 md:p-6 safe-area-bottom">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          {/* Informações do Perfil */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-base sm:text-lg md:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-gray-300 text-sm">Nome Completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1 mobile-input"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-1 mobile-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full sm:w-auto bg-green-primary hover:bg-green-hover text-white mobile-button"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-base sm:text-lg md:text-xl">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 text-sm">Email de Login</Label>
                <div className="text-white bg-gray-800 p-3 rounded border border-gray-600 mt-1 text-sm break-all">
                  {user?.email || 'Não informado'}
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300 text-sm">Data de Cadastro</Label>
                <div className="text-white bg-gray-800 p-3 rounded border border-gray-600 mt-1 text-sm">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 
                   user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações da Conta */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base sm:text-lg md:text-xl">Ações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 mobile-button"
              >
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

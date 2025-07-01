
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save, Mail } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Perfil() {
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfile, isUpdatingProfile } = useProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Inicializar campos quando o perfil carregar
  useState(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
    }
  });

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
      <div className="min-h-screen bg-darker-blue">
        <Header title="Meu Perfil" />
        <main className="p-6">
          <div className="text-white text-center">Carregando perfil...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Meu Perfil" />
      
      <main className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Informações do Perfil */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-gray-300">Nome Completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-green-primary hover:bg-green-hover text-white"
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
              <CardTitle className="text-white flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Email de Login</Label>
                <div className="text-white bg-gray-800 p-3 rounded border border-gray-600">
                  {user?.email}
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300">Data de Cadastro</Label>
                <div className="text-white bg-gray-800 p-3 rounded border border-gray-600">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações da Conta */}
          <Card className="bg-dark-blue border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Ações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
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

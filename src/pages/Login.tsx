
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          navigate('/dashboard');
        }
      } else {
        if (!fullName) {
          toast.error('Nome completo é obrigatório');
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Conta criada com sucesso! Verifique seu email.');
        }
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-dark-blue border-gray-700">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-primary rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Planejai</CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Gerencie suas finanças pessoais e empresariais
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 ${
                isLogin 
                  ? 'bg-green-primary hover:bg-green-hover text-white' 
                  : 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Entrar
            </Button>
            <Button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 ${
                !isLogin 
                  ? 'bg-green-primary hover:bg-green-hover text-white' 
                  : 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Cadastrar
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="Digite seu email aqui"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-primary hover:bg-green-hover text-white font-medium"
            >
              {loading 
                ? 'Carregando...' 
                : isLogin ? 'Entrar' : 'Cadastrar'
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

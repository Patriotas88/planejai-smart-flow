
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darker-blue">
      <div className="text-center p-8 max-w-md w-full mx-4">
        <div className="mb-8">
          <div className="text-8xl font-bold text-green-primary mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-2">Página não encontrada</h1>
          <p className="text-gray-400 mb-6">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleRefresh}
            className="w-full bg-green-primary hover:bg-green-600 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Página
          </Button>
          
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Ir para Dashboard
          </Button>

          <Button 
            onClick={handleGoBack}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Rota tentada: <code className="bg-gray-800 px-2 py-1 rounded">{location.pathname}</code>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

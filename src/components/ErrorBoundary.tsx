
import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-darker-blue">
          <div className="text-center p-8 max-w-md w-full mx-4">
            <div className="mb-8">
              <div className="text-6xl font-bold text-red-500 mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-white mb-2">Algo deu errado</h1>
              <p className="text-gray-400 mb-6">
                Ocorreu um erro inesperado. Tente atualizar a página ou voltar ao início.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={this.handleRefresh}
                className="w-full bg-green-primary hover:bg-green-600 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Página
              </Button>
              
              <Button 
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir para Dashboard
              </Button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                  Detalhes do erro (para desenvolvedor)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 bg-gray-800 p-3 rounded overflow-x-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

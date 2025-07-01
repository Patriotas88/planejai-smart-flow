
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Verifica se há histórico de navegação
    setCanGoBack(window.history.length > 1);
  }, [location]);

  const goBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      // Se não há histórico, vai para o dashboard
      navigate('/dashboard');
    }
  };

  return { canGoBack, goBack };
}

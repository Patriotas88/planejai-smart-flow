import { Header } from '@/components/Header';
import { useState, useEffect } from 'react';

interface PerfilProps {
  onMenuClick?: () => void;
}

export default function Perfil({ onMenuClick }: PerfilProps) {
  const [userData, setUserData] = useState({
    name: 'Usuário Teste',
    email: 'teste@example.com',
    phone: '(11) 99999-9999',
  });

  useEffect(() => {
    // Simulação de carregamento de dados do usuário
    setTimeout(() => {
      setUserData({
        name: 'Usuário Teste Atualizado',
        email: 'teste_atualizado@example.com',
        phone: '(11) 98888-8888',
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-darker-blue">
      <Header title="Meu Perfil" onMenuClick={onMenuClick} />
      
      <main className="p-4 md:p-6 space-y-6">
        <div className="bg-dark-blue rounded-lg shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Informações do Perfil</h2>
          
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="font-medium text-gray-100">Nome:</span> {userData.name}
            </p>
            <p className="text-gray-300">
              <span className="font-medium text-gray-100">Email:</span> {userData.email}
            </p>
            <p className="text-gray-300">
              <span className="font-medium text-gray-100">Telefone:</span> {userData.phone}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

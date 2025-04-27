import React from 'react';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { BarChart3, Users } from 'lucide-react';

const BreadcrumbExample = () => {
  const breadcrumbItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart3 className="h-4 w-4 mr-1" />
    },
    {
      label: 'Usuários',
      href: '/usuarios',
      icon: <Users className="h-4 w-4 mr-1" />
    },
    {
      label: 'Detalhes do Usuário',
    }
  ];

  return (
    <div className="p-4">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="mt-4">
        <h1 className="text-2xl font-bold">Página de Exemplo</h1>
        <p className="mt-2">Este é um exemplo de como usar o componente de navegação breadcrumb.</p>
      </div>
    </div>
  );
};

export default BreadcrumbExample; 
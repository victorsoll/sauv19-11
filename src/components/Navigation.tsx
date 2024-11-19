import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  ClipboardList, 
  CreditCard, 
  LayoutDashboard, 
  Settings,
  TrendingUp,
  Package,
  DollarSign,
  BarChart2,
  Cog
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      icon: Package, 
      activeIcon: TrendingUp,
      label: t('nav.stock'), 
      path: '/stock' 
    },
    { 
      icon: ClipboardList, 
      activeIcon: ClipboardList,
      label: t('nav.consignment'), 
      path: '/consignment' 
    },
    { 
      icon: CreditCard, 
      activeIcon: DollarSign,
      label: t('nav.sales'), 
      path: '/sales' 
    },
    { 
      icon: LayoutDashboard, 
      activeIcon: BarChart2,
      label: t('nav.dashboard'), 
      path: '/dashboard' 
    },
    { 
      icon: Settings, 
      activeIcon: Cog,
      label: t('nav.settings'), 
      path: '/settings' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map(({ icon: Icon, activeIcon: ActiveIcon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 transition-all duration-200 ${
                isActive(path) 
                  ? 'text-red-500 scale-110' 
                  : 'text-gray-400 hover:text-white hover:scale-105'
              }`}
            >
              {isActive(path) ? <ActiveIcon size={20} /> : <Icon size={20} />}
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
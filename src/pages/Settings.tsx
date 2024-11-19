import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { 
  User, 
  LogOut, 
  Bell, 
  Mail, 
  Globe, 
  CreditCard, 
  Shield, 
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import SubscriptionCard from '../components/SubscriptionCard';

function Settings() {
  const { t } = useTranslation();
  const { logout, user } = useAuthStore();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);

  const handleLanguageChange = (lang: string) => {
    const { i18n } = useTranslation();
    i18n.changeLanguage(lang);
  };

  return (
    <div className="pt-6 pb-20 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>
      
      <div className="space-y-6">
        {/* Compte */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">{t('settings.account')}</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium">{user?.email || 'utilisateur@example.com'}</h3>
                <p className="text-sm text-gray-400">Membre depuis le 15 mars 2024</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={logout}
                className="w-full py-2 px-4 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                {t('settings.logout')}
              </button>
            </div>
          </div>
        </div>

        {/* Abonnement */}
        <SubscriptionCard />

        {/* Langue */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">{t('settings.language.title')}</h2>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            {[
              { code: 'fr', label: t('settings.language.fr'), flag: '🇫🇷' },
              { code: 'en', label: t('settings.language.en'), flag: '🇬🇧' },
              { code: 'de', label: t('settings.language.de'), flag: '🇩🇪' },
              { code: 'es', label: t('settings.language.es'), flag: '🇪🇸' },
            ].map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className="py-3 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-3"
              >
                <span className="text-xl">{flag}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">{t('settings.notifications.title')}</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="block">{t('settings.notifications.email')}</span>
                  <span className="text-sm text-gray-400">Recevez des mises à jour par email</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="block">{t('settings.notifications.push')}</span>
                  <span className="text-sm text-gray-400">Recevez des notifications push</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
              />
            </label>
          </div>
        </div>

        {/* Aide et Support */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">Aide et Support</h2>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <a 
              href="#" 
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Centre d'aide</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Contacter le support</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Conditions d'utilisation</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Version */}
        <div className="text-center text-sm text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}

export default Settings;
import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Lock, Mail, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      alert('Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500 p-4 rounded-2xl">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Stocktor
          </h2>
          <p className="text-gray-400">
            Gérez votre business de revente efficacement
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-gray-800 p-6 rounded-xl" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Se connecter
            </button>
          </div>

          <div className="text-center">
            <a href="#" className="text-sm text-red-500 hover:text-red-400">
              Mot de passe oublié ?
            </a>
          </div>
        </form>

        <div className="text-center text-sm text-gray-400">
          Pas encore de compte ?{' '}
          <a href="#" className="text-red-500 hover:text-red-400 font-medium">
            Créer un compte
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
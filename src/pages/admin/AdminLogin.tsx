import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInAdmin } from '../../lib/auth';
import { Shield, Eye, EyeOff, Zap, Globe } from 'lucide-react';
import { ADMIN_ROUTES } from '../../lib/admin-routes';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const admin = await signInAdmin(email, password);

      if (admin) {
        navigate(ADMIN_ROUTES.DASHBOARD);
      } else {
        setError(t('admin.login.error'));
      }
    } catch (error) {
      setError(t('admin.login.error'));
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-glow p-8 relative">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              title={language === 'en' ? 'Switch to Swedish' : 'Växla till engelska'}
            >
              <Globe className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">{language.toUpperCase()}</span>
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-3xl font-black text-gray-900 tracking-tight">{t('admin.login.title')}</h1>
            <p className="text-gray-600 mt-2">{t('admin.login.subtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.login.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                placeholder="admin@northforce.io"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                  placeholder={t('admin.login.password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-3 rounded-lg hover:shadow-glow transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('admin.login.signing_in') : t('admin.login.button')}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              to="/admin/setup"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <Zap className="h-4 w-4" />
              {language === 'sv' ? 'Första gången? Kör initial setup' : 'First time? Run initial setup'}
            </Link>
            <p className="text-sm text-gray-500">
              {language === 'sv' ? 'Säker adminåtkomst endast för NorthForce-teammedlemmar' : 'Secure admin access for NorthForce team members only'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-400">
              {t('build.version')} | {new Date().toLocaleString(language === 'sv' ? 'sv-SE' : 'en-US')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

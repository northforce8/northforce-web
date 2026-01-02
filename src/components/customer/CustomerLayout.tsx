import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, TrendingUp, HelpCircle, LogOut, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface CustomerUser {
  id: string;
  email: string;
  company_name?: string;
}

const CustomerLayout: React.FC = () => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/customer/login');
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.role !== 'customer') {
          await supabase.auth.signOut();
          navigate('/customer/login');
          return;
        }

        const { data: customer } = await supabase
          .from('customers')
          .select('company_name')
          .eq('email', session.user.email)
          .maybeSingle();

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          company_name: customer?.company_name,
        });
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate('/customer/login');
      }
    };

    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/customer/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/customer/portal',
      icon: LayoutDashboard,
      label: t('customer.nav.overview'),
    },
    {
      path: '/customer/portal/activity',
      icon: TrendingUp,
      label: t('customer.nav.activity'),
    },
    {
      path: '/customer/portal/documents',
      icon: FileText,
      label: t('customer.nav.documents'),
    },
    {
      path: '/customer/portal/help',
      icon: HelpCircle,
      label: t('customer.nav.help'),
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('customer.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <img
            src="/northforce-symbol-clean.png"
            alt="NorthForce"
            className="h-10 w-10 mb-3"
          />
          <h2 className="text-sm font-semibold text-gray-900">{user.company_name || user.email}</h2>
          <p className="text-xs text-gray-500 mt-1">{t('customer.portal.title')}</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language.toUpperCase()}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {t('customer.sign_out')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;

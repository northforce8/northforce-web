import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  Clock,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Globe,
  TrendingUp,
  UserCog,
  MessageSquare,
  Sparkles,
  Activity,
  Coins,
  Gauge,
  Zap,
  ExternalLink,
  Receipt,
  FileSignature,
  Calendar,
  LifeBuoy,
  PieChart,
  CreditCard,
  ListChecks
} from 'lucide-react';
import { getCurrentUser, signOut } from '../../lib/auth';
import type { AdminUser } from '../../lib/auth';
import { ADMIN_ROUTES, ADMIN_NAVIGATION_GROUPED } from '../../lib/admin-routes';
import type { AdminNavGroup } from '../../lib/admin-routes';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLayout: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate('/admin-login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        navigate('/admin-login');
      }
    };
    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin-login');
  };

  const isActive = (path: string) => {
    if (path === ADMIN_ROUTES.DASHBOARD) {
      return location.pathname === ADMIN_ROUTES.DASHBOARD || location.pathname === ADMIN_ROUTES.BASE;
    }
    if (location.pathname === ADMIN_ROUTES.DASHBOARD || location.pathname === ADMIN_ROUTES.BASE) {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    [ADMIN_ROUTES.DASHBOARD]: LayoutDashboard,
    [ADMIN_ROUTES.LEADS_MANAGEMENT]: ListChecks,
    [ADMIN_ROUTES.ENTERPRISE]: TrendingUp,
    [ADMIN_ROUTES.ENTERPRISE_PLANS]: Activity,
    [ADMIN_ROUTES.CREDITS]: Coins,
    [ADMIN_ROUTES.CUSTOMERS]: Building2,
    [ADMIN_ROUTES.PROJECTS]: FolderKanban,
    [ADMIN_ROUTES.TIME]: Clock,
    [ADMIN_ROUTES.INVOICES]: Receipt,
    [ADMIN_ROUTES.BILLING_PERIODS]: CreditCard,
    [ADMIN_ROUTES.CONTRACTS]: FileSignature,
    [ADMIN_ROUTES.PARTNER_MANAGEMENT]: UserCog,
    [ADMIN_ROUTES.CAPACITY]: Gauge,
    [ADMIN_ROUTES.PLANNING]: Calendar,
    [ADMIN_ROUTES.NOTES]: FileText,
    [ADMIN_ROUTES.REPORTS]: BarChart3,
    [ADMIN_ROUTES.MARGIN_ANALYSIS]: PieChart,
    [ADMIN_ROUTES.SUPPORT]: LifeBuoy,
    [ADMIN_ROUTES.SETTINGS]: Settings,
    [ADMIN_ROUTES.HEALTH]: Activity,
    'https://northforce.io': ExternalLink,
  };

  const filteredNavGroups = ADMIN_NAVIGATION_GROUPED
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(user?.role || ''))
    }))
    .filter(group => group.roles.includes(user?.role || '') && group.items.length > 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to={ADMIN_ROUTES.DASHBOARD} className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-violet-500 absolute -top-1 -right-1" style={{color: '#7B61FF'}} />
                <Zap className="h-8 w-8" style={{color: '#00A8E8'}} />
              </div>
              <span className="font-heading text-xl font-black text-gray-900 whitespace-nowrap">NorthForce</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3">
              {filteredNavGroups.map((group, groupIndex) => {
                const groupKey = `admin.nav.${group.label.toLowerCase().replace(/\s+/g, '_')}`;
                return (
                <div key={group.label} className={groupIndex === 0 ? '' : 'mt-6 pt-6 border-t border-gray-200'}>
                  <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(groupKey)}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = iconMap[item.path] || FileText;
                      const labelKey = `admin.nav.${item.label.toLowerCase().replace(/\s+/g, '_').replace(/&/g, '').replace(/__+/g, '_')}`;
                      const translatedLabel = t(labelKey) !== labelKey ? t(labelKey) : item.label;

                      if (item.external) {
                        return (
                          <a
                            key={item.path}
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            {translatedLabel}
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive(item.path)
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {translatedLabel}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )})}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            <button
              onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
              className="w-full flex items-center justify-center px-3 py-2 mb-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={language === 'en' ? 'Switch to Swedish' : 'Växla till engelska'}
            >
              <Globe className="h-4 w-4 mr-2" />
              {language.toUpperCase()}
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('admin.sign_out')}
            </button>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-200 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="min-h-screen p-6">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

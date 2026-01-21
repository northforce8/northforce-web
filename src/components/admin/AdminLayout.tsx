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
  ListChecks,
  Target,
  Briefcase,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  Home
} from 'lucide-react';
import { getCurrentUser, signOut } from '../../lib/auth';
import type { AdminUser } from '../../lib/auth';
import { ADMIN_ROUTES, ADMIN_NAVIGATION_GROUPED } from '../../lib/admin-routes';
import type { AdminNavGroup } from '../../lib/admin-routes';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLayout: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      console.error('=== WINDOW ERROR CAPTURED ===');
      console.error('Message:', event.message);
      console.error('Source:', event.filename);
      console.error('Line:', event.lineno);
      console.error('Column:', event.colno);
      console.error('Error:', event.error);
      console.error('Stack:', event.error?.stack);
      console.error('===========================');

      const errorMessage = `
Window Error Captured:
Message: ${event.message}
Source: ${event.filename}:${event.lineno}:${event.colno}
Route: ${window.location.pathname}
Language: ${localStorage.getItem('language') || 'en'}
Stack: ${event.error?.stack || 'No stack available'}
Build: 2025.01.15-1411
      `.trim();

      setGlobalError(errorMessage);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('=== UNHANDLED PROMISE REJECTION ===');
      console.error('Reason:', event.reason);
      console.error('Promise:', event.promise);
      console.error('===================================');

      const errorMessage = `
Unhandled Promise Rejection:
Reason: ${event.reason}
Route: ${window.location.pathname}
Language: ${localStorage.getItem('language') || 'en'}
Build: 2025.01.15-1411
      `.trim();

      setGlobalError(errorMessage);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      try {
        setAuthLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        const currentUser = await getCurrentUser();
        if (!isMounted) return;
      if (!currentUser) {
  // No redirect here – keep layout stable and let pages render empty state
  setUser(null);
  setAuthLoading(false);
  return;
}
        setUser(currentUser);
        setAuthLoading(false);
   } catch (error) {
  console.error('Error loading user:', error);
  if (!isMounted) return;

  // Do not redirect on errors – keep UI stable and show empty/error state
  setUser(null);
  setAuthLoading(false);
}

    };
    loadUser();
    return () => {
      isMounted = false;
    };
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

  const isGroupActive = (group: AdminNavGroup) => {
    return group.items.some(item => isActive(item.path));
  };

  useEffect(() => {
    if (!user) return;

    const filteredGroups = ADMIN_NAVIGATION_GROUPED
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.roles.includes(user.role))
      }))
      .filter(group => group.roles.includes(user.role) && group.items.length > 0);

    const activeGroup = filteredGroups.find(group => isGroupActive(group));

    if (activeGroup) {
      const savedExpandedGroup = localStorage.getItem('admin-expanded-group');

      if (savedExpandedGroup && filteredGroups.some(g => g.label === savedExpandedGroup)) {
        setExpandedGroup(savedExpandedGroup);
      } else if (!expandedGroup || !filteredGroups.some(g => g.label === expandedGroup)) {
        setExpandedGroup(activeGroup.label);
        localStorage.setItem('admin-expanded-group', activeGroup.label);
      }
    }
  }, [location.pathname, user]);

  const toggleGroup = (groupLabel: string) => {
    const newExpandedGroup = expandedGroup === groupLabel ? null : groupLabel;
    setExpandedGroup(newExpandedGroup);
    if (newExpandedGroup) {
      localStorage.setItem('admin-expanded-group', newExpandedGroup);
    } else {
      localStorage.removeItem('admin-expanded-group');
    }
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
    [ADMIN_ROUTES.GROWTH_PLANS]: TrendingUp,
    [ADMIN_ROUTES.LEADERSHIP_ASSESSMENTS]: Users,
    [ADMIN_ROUTES.MARKETING_CAMPAIGNS]: Target,
    [ADMIN_ROUTES.BUSINESS_MODELS]: Briefcase,
    [ADMIN_ROUTES.BEST_PRACTICES]: Lightbulb,
    [ADMIN_ROUTES.METHODOLOGY_TEMPLATES]: FileText,
    'https://northforce.io': ExternalLink,
  };

  const filteredNavGroups = ADMIN_NAVIGATION_GROUPED
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(user?.role || ''))
    }))
    .filter(group => group.roles.includes(user?.role || '') && group.items.length > 0);

  if (globalError) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600 flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Fatal Admin Error - White Screen Prevented
              </h1>
              <p className="text-gray-600 mt-1">
                Window-level error captured outside React
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 mb-6">
            <h2 className="text-base font-bold text-red-900 mb-3 uppercase tracking-wide">
              Error Details
            </h2>
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 overflow-auto max-h-96">
              <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
                {globalError}
              </pre>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <RefreshCw className="h-5 w-5" />
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = ADMIN_ROUTES.DASHBOARD}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <Home className="h-5 w-5" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{authLoading ? 'Loading...' : 'Redirecting...'}</p>
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
                const groupKey = `admin.nav.${group.label.toLowerCase().replace(/\s+/g, '_').replace(/&/g, '').replace(/__+/g, '_')}`;
                const isExpanded = expandedGroup === group.label;
                const isGroupHighlighted = isGroupActive(group);

                return (
                <div key={group.label} className={groupIndex === 0 ? '' : 'mt-4'}>
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                      isGroupHighlighted
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{t(groupKey)}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="mt-1 space-y-1 pl-2">
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
                              <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                              <span className="truncate">{translatedLabel}</span>
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              isActive(item.path)
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                            <span className="truncate">{translatedLabel}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )})}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-1">
<p className="text-sm font-medium text-gray-900">{user?.name || user?.email || ''}</p>
<p className="text-xs text-gray-500 capitalize">{user?.role || ''}</p>

              </div>
            </div>

            <button
              onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
              className="w-full flex items-center justify-center px-3 py-2 mb-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={language === 'en' ? 'Switch to Swedish' : 'Växla till engelska'}
            >
              <Globe className="h-4 w-4 mr-2" />
{(language || 'en').toUpperCase()}
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

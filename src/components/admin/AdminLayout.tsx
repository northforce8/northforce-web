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
import { ADMIN_ROUTES, ADMIN_NAV_LABELS } from '../../lib/admin-routes';

const AdminLayout: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/admin-login');
        return;
      }
      setUser(currentUser);
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

  const navItems = [
    { path: ADMIN_ROUTES.DASHBOARD, label: ADMIN_NAV_LABELS.DASHBOARD, icon: LayoutDashboard, roles: ['admin', 'partner'] },
    { path: ADMIN_ROUTES.LEADS_MANAGEMENT, label: ADMIN_NAV_LABELS.LEADS_MANAGEMENT, icon: ListChecks, roles: ['admin'] },
    { path: ADMIN_ROUTES.ENTERPRISE, label: ADMIN_NAV_LABELS.ENTERPRISE_INTELLIGENCE, icon: TrendingUp, roles: ['admin'] },
    { path: ADMIN_ROUTES.ENTERPRISE_PLANS, label: ADMIN_NAV_LABELS.ENTERPRISE_PLANS, icon: Activity, roles: ['admin'] },
    { path: ADMIN_ROUTES.CREDITS, label: ADMIN_NAV_LABELS.CREDITS, icon: Coins, roles: ['admin'] },
    { path: ADMIN_ROUTES.CUSTOMERS, label: ADMIN_NAV_LABELS.CUSTOMERS, icon: Building2, roles: ['admin', 'partner'] },
    { path: ADMIN_ROUTES.PROJECTS, label: ADMIN_NAV_LABELS.PROJECTS, icon: FolderKanban, roles: ['admin', 'partner'] },
    { path: ADMIN_ROUTES.TIME, label: ADMIN_NAV_LABELS.TIME_REPORTING, icon: Clock, roles: ['admin', 'partner'] },
    { path: ADMIN_ROUTES.INVOICES, label: ADMIN_NAV_LABELS.INVOICES, icon: Receipt, roles: ['admin'] },
    { path: ADMIN_ROUTES.BILLING_PERIODS, label: ADMIN_NAV_LABELS.BILLING_PERIODS, icon: CreditCard, roles: ['admin'] },
    { path: ADMIN_ROUTES.CONTRACTS, label: ADMIN_NAV_LABELS.CONTRACTS, icon: FileSignature, roles: ['admin'] },
    { path: ADMIN_ROUTES.PARTNER_MANAGEMENT, label: ADMIN_NAV_LABELS.PARTNER_MANAGEMENT, icon: UserCog, roles: ['admin'] },
    { path: ADMIN_ROUTES.CAPACITY, label: ADMIN_NAV_LABELS.CAPACITY, icon: Gauge, roles: ['admin'] },
    { path: ADMIN_ROUTES.PLANNING, label: ADMIN_NAV_LABELS.PLANNING, icon: Calendar, roles: ['admin'] },
    { path: ADMIN_ROUTES.NOTES, label: ADMIN_NAV_LABELS.NOTES, icon: FileText, roles: ['admin', 'partner'] },
    { path: ADMIN_ROUTES.REPORTS, label: ADMIN_NAV_LABELS.REPORTS, icon: BarChart3, roles: ['admin'] },
    { path: ADMIN_ROUTES.MARGIN_ANALYSIS, label: ADMIN_NAV_LABELS.MARGIN_ANALYSIS, icon: PieChart, roles: ['admin'] },
    { path: ADMIN_ROUTES.SUPPORT, label: ADMIN_NAV_LABELS.SUPPORT, icon: LifeBuoy, roles: ['admin'] },
    { path: ADMIN_ROUTES.SETTINGS, label: ADMIN_NAV_LABELS.SETTINGS, icon: Settings, roles: ['admin'] },
    { path: ADMIN_ROUTES.HEALTH, label: ADMIN_NAV_LABELS.HEALTH, icon: Activity, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role || ''));

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
            <nav className="px-3 space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
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
                    {item.label}
                  </Link>
                );
              })}

              <a
                href="https://northforce.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-700 mt-4 border-t border-gray-200 pt-4"
              >
                <ExternalLink className="h-5 w-5 mr-3" />
                Website
              </a>
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
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
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

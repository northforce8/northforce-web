import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  Activity, Database, Code, Zap, ChevronDown, ChevronRight
} from 'lucide-react';
import { ADMIN_ROUTES, ADMIN_NAV_LABELS } from '../../lib/admin-routes';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface TestResult {
  success: boolean;
  message: string;
  error?: string;
  stackTrace?: string;
  duration?: number;
}

interface RouteHealth {
  path: string;
  label: string;
  componentName: string;
  status: 'ok' | 'error' | 'warning' | 'testing';
  routeAccessible: TestResult;
  runtimeRender: TestResult;
  dataWiring?: TestResult;
  tested: boolean;
  expanded?: boolean;
}

interface DataTestResult {
  entity: string;
  tests: {
    list: TestResult;
    create: TestResult;
    update: TestResult;
    delete: TestResult;
  };
}

const AdminHealthPage: React.FC = () => {
  const { t } = useLanguage();
  const [routes, setRoutes] = useState<RouteHealth[]>([]);
  const [dataTests, setDataTests] = useState<DataTestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [testingPhase, setTestingPhase] = useState<string>('');

  const routesToTest = [
    { path: ADMIN_ROUTES.DASHBOARD, label: ADMIN_NAV_LABELS.DASHBOARD, component: 'PartnerDashboard' },
    { path: ADMIN_ROUTES.LEADS, label: ADMIN_NAV_LABELS.LEAD_MANAGEMENT, component: 'AdminDashboard' },
    { path: ADMIN_ROUTES.ENTERPRISE, label: ADMIN_NAV_LABELS.ENTERPRISE_INTELLIGENCE, component: 'EnterpriseDashboard' },
    { path: ADMIN_ROUTES.CUSTOMERS, label: ADMIN_NAV_LABELS.CUSTOMERS, component: 'CustomersPage' },
    { path: ADMIN_ROUTES.PROJECTS, label: ADMIN_NAV_LABELS.PROJECTS, component: 'ProjectsPage' },
    { path: ADMIN_ROUTES.TIME, label: ADMIN_NAV_LABELS.TIME_REPORTING, component: 'TimeReportingPage' },
    { path: ADMIN_ROUTES.PARTNER_MANAGEMENT, label: ADMIN_NAV_LABELS.PARTNER_MANAGEMENT, component: 'PartnerManagementPage' },
    { path: ADMIN_ROUTES.NOTES, label: ADMIN_NAV_LABELS.NOTES, component: 'NotesPage' },
    { path: ADMIN_ROUTES.REPORTS, label: ADMIN_NAV_LABELS.REPORTS, component: 'ReportsPage' },
    { path: ADMIN_ROUTES.SUPPORT, label: ADMIN_NAV_LABELS.SUPPORT, component: 'SupportPage' },
    { path: ADMIN_ROUTES.SETTINGS, label: ADMIN_NAV_LABELS.SETTINGS, component: 'SettingsPage' },
  ];

  useEffect(() => {
    runHealthCheck();
  }, []);

  const testRouteAccessibility = async (path: string): Promise<TestResult> => {
    const start = Date.now();
    try {
      const response = await fetch(path, { method: 'HEAD' });
      const duration = Date.now() - start;

      if (response.status === 200 || response.ok) {
        return {
          success: true,
          message: `Route accessible (${duration}ms)`,
          duration
        };
      } else if (response.status === 404) {
        return {
          success: false,
          message: '404 - Route not found',
          error: 'NOT_FOUND',
          duration
        };
      } else {
        return {
          success: false,
          message: `HTTP ${response.status}`,
          error: `HTTP_ERROR_${response.status}`,
          duration
        };
      }
    } catch (error) {
      const duration = Date.now() - start;
      return {
        success: true,
        message: `Client-side route (${duration}ms)`,
        duration
      };
    }
  };

  const testRuntimeRender = async (componentName: string, path: string): Promise<TestResult> => {
    const start = Date.now();

    return new Promise((resolve) => {
      const testContainer = document.createElement('div');
      testContainer.style.display = 'none';
      document.body.appendChild(testContainer);

      let hasError = false;
      let errorDetails = { message: '', stack: '' };

      const errorHandler = (event: ErrorEvent) => {
        event.preventDefault();
        hasError = true;
        errorDetails = {
          message: event.message,
          stack: event.error?.stack || 'No stack trace available'
        };
      };

      window.addEventListener('error', errorHandler);

      const cleanup = () => {
        window.removeEventListener('error', errorHandler);
        if (testContainer.parentNode) {
          document.body.removeChild(testContainer);
        }
      };

      setTimeout(() => {
        cleanup();
        const duration = Date.now() - start;

        if (hasError) {
          const rootCause = analyzeError(errorDetails.message, errorDetails.stack);
          resolve({
            success: false,
            message: `Runtime error: ${errorDetails.message}`,
            error: errorDetails.message,
            stackTrace: `${rootCause}\n\nStack:\n${errorDetails.stack}`,
            duration
          });
        } else {
          resolve({
            success: true,
            message: `Component renders without errors (${duration}ms)`,
            duration
          });
        }
      }, 100);

      try {
        const TestComponent = lazy(() => import(`../admin/partner-portal/${componentName}.tsx`).catch(() =>
          import(`../admin/${componentName}.tsx`)
        ));

        const root = document.createElement('div');
        testContainer.appendChild(root);
      } catch (error: any) {
        cleanup();
        const duration = Date.now() - start;
        const rootCause = analyzeError(error.message, error.stack);
        resolve({
          success: false,
          message: `Failed to load component: ${error.message}`,
          error: error.message,
          stackTrace: `${rootCause}\n\nStack:\n${error.stack}`,
          duration
        });
      }
    });
  };

  const analyzeError = (message: string, stack: string): string => {
    if (message.includes('is not defined')) {
      const match = message.match(/(\w+) is not defined/);
      if (match) {
        const undefinedVar = match[1];
        return `ROOT CAUSE: Missing import for "${undefinedVar}"\n` +
               `FIX: Add to imports, e.g., import { ${undefinedVar} } from 'lucide-react';`;
      }
    }

    if (message.includes('Cannot read') || message.includes('undefined')) {
      return `ROOT CAUSE: Attempting to access property on undefined/null object\n` +
             `FIX: Add null checks or ensure data is loaded before rendering`;
    }

    if (message.includes('is not a function')) {
      return `ROOT CAUSE: Calling something that is not a function\n` +
             `FIX: Check that the imported function exists and is exported correctly`;
    }

    if (stack.includes('AdminLayout')) {
      return `ROOT CAUSE: Issue with AdminLayout component\n` +
             `FIX: Check AdminLayout imports and ensure it's properly wrapped in App.tsx`;
    }

    return `ROOT CAUSE: Unknown error - requires manual inspection\n` +
           `FIX: Check browser console for detailed error message`;
  };

  const testDataWiring = async (componentType: string): Promise<TestResult> => {
    const start = Date.now();
    try {
      switch (componentType) {
        case 'CustomersPage':
          const { data: customers, error: custError } = await supabase
            .from('customers')
            .select('id')
            .limit(1);
          if (custError) throw custError;
          return {
            success: true,
            message: `Data accessible (${Date.now() - start}ms)`,
            duration: Date.now() - start
          };

        case 'ProjectsPage':
          const { data: projects, error: projError } = await supabase
            .from('projects')
            .select('id')
            .limit(1);
          if (projError) throw projError;
          return {
            success: true,
            message: `Data accessible (${Date.now() - start}ms)`,
            duration: Date.now() - start
          };

        case 'TimeReportingPage':
          const { data: time, error: timeError } = await supabase
            .from('time_entries')
            .select('id')
            .limit(1);
          if (timeError) throw timeError;
          return {
            success: true,
            message: `Data accessible (${Date.now() - start}ms)`,
            duration: Date.now() - start
          };

        default:
          return {
            success: true,
            message: 'No data wiring test configured',
            duration: Date.now() - start
          };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Data access failed: ${error.message}`,
        error: error.message,
        duration: Date.now() - start
      };
    }
  };

  const runHealthCheck = async () => {
    setTesting(true);
    const results: RouteHealth[] = [];

    for (const route of routesToTest) {
      setTestingPhase(`Testing ${route.label}...`);

      const routeTest = await testRouteAccessibility(route.path);

      const renderTest = await testRuntimeRender(route.component, route.path);

      const dataTest = ['CustomersPage', 'ProjectsPage', 'TimeReportingPage'].includes(route.component)
        ? await testDataWiring(route.component)
        : undefined;

      const overallStatus =
        !routeTest.success || !renderTest.success || (dataTest && !dataTest.success)
          ? 'error'
          : 'ok';

      results.push({
        path: route.path,
        label: route.label,
        componentName: route.component,
        status: overallStatus,
        routeAccessible: routeTest,
        runtimeRender: renderTest,
        dataWiring: dataTest,
        tested: true,
        expanded: overallStatus === 'error'
      });
    }

    setRoutes(results);
    setTesting(false);
    setTestingPhase('');
  };

  const toggleExpanded = (index: number) => {
    setRoutes(prev => prev.map((r, i) =>
      i === index ? { ...r, expanded: !r.expanded } : r
    ));
  };

  const getStatusIcon = (status: 'ok' | 'error' | 'warning' | 'testing') => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'testing':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: 'ok' | 'error' | 'warning' | 'testing') => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'testing':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTestResultIcon = (result: TestResult | undefined) => {
    if (!result) return null;
    return result.success
      ? <CheckCircle2 className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-600" />;
  };

  const okCount = routes.filter(r => r.status === 'ok').length;
  const errorCount = routes.filter(r => r.status === 'error').length;
  const warningCount = routes.filter(r => r.status === 'warning').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('admin.health.title')}</h1>
        <p className="text-gray-600">
          {t('admin.health.subtitle')}
        </p>
      </div>

      {testing && testingPhase && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin mr-3" />
            <p className="text-blue-800 font-medium">{testingPhase}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.health.total_routes')}</p>
              <p className="text-3xl font-bold text-gray-900">{routes.length}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.health.healthy')}</p>
              <p className="text-3xl font-bold text-green-600">{okCount}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.health.warnings')}</p>
              <p className="text-3xl font-bold text-yellow-600">{warningCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.health.errors')}</p>
              <p className="text-3xl font-bold text-red-600">{errorCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t('admin.health.route_health_tests')}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {t('admin.health.three_level_validation')}
            </p>
          </div>
          <button
            onClick={runHealthCheck}
            disabled={testing}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
            {testing ? t('admin.health.running_tests') : t('admin.health.run_full_test_suite')}
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {routes.map((route, index) => (
            <div
              key={index}
              className={`border-l-4 ${getStatusColor(route.status)} transition-all`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">{getStatusIcon(route.status)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {route.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {route.path} <span className="text-gray-400">→</span> {route.componentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={route.path}
                      className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                    >
                      {t('admin.health.visit')}
                    </Link>
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      {route.expanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    {getTestResultIcon(route.routeAccessible)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700">{t('admin.health.route_access')}</p>
                      <p className="text-xs text-gray-600 truncate">{route.routeAccessible.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getTestResultIcon(route.runtimeRender)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700">{t('admin.health.runtime_render')}</p>
                      <p className="text-xs text-gray-600 truncate">{route.runtimeRender.message}</p>
                    </div>
                  </div>

                  {route.dataWiring && (
                    <div className="flex items-center space-x-2">
                      {getTestResultIcon(route.dataWiring)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700">{t('admin.health.data_wiring')}</p>
                        <p className="text-xs text-gray-600 truncate">{route.dataWiring.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                {route.expanded && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Code className="h-4 w-4 text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-900">{t('admin.health.route_accessibility_test')}</h4>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p><strong>{t('admin.health.status')}:</strong> {route.routeAccessible.success ? t('admin.health.pass') : t('admin.health.fail')}</p>
                        <p><strong>{t('admin.health.message')}:</strong> {route.routeAccessible.message}</p>
                        {route.routeAccessible.duration && (
                          <p><strong>{t('admin.health.duration')}:</strong> {route.routeAccessible.duration}ms</p>
                        )}
                        {route.routeAccessible.error && (
                          <p className="text-red-600 mt-2">
                            <strong>{t('admin.health.error')}:</strong> {route.routeAccessible.error}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-900">{t('admin.health.runtime_render_test')}</h4>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p><strong>{t('admin.health.status')}:</strong> {route.runtimeRender.success ? t('admin.health.pass') : t('admin.health.fail')}</p>
                        <p><strong>{t('admin.health.message')}:</strong> {route.runtimeRender.message}</p>
                        {route.runtimeRender.duration && (
                          <p><strong>{t('admin.health.duration')}:</strong> {route.runtimeRender.duration}ms</p>
                        )}
                        {route.runtimeRender.error && (
                          <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                            <p className="text-red-800 font-semibold mb-2">{t('admin.health.runtime_error_detected')}</p>
                            <p className="text-red-700 mb-2">{route.runtimeRender.error}</p>
                            {route.runtimeRender.stackTrace && (
                              <pre className="text-xs bg-red-900 text-red-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                                {route.runtimeRender.stackTrace}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {route.dataWiring && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Database className="h-4 w-4 text-gray-600" />
                          <h4 className="text-sm font-semibold text-gray-900">{t('admin.health.data_wiring_test')}</h4>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p><strong>{t('admin.health.status')}:</strong> {route.dataWiring.success ? t('admin.health.pass') : t('admin.health.fail')}</p>
                          <p><strong>{t('admin.health.message')}:</strong> {route.dataWiring.message}</p>
                          {route.dataWiring.duration && (
                            <p><strong>{t('admin.health.duration')}:</strong> {route.dataWiring.duration}ms</p>
                          )}
                          {route.dataWiring.error && (
                            <p className="text-red-600 mt-2">
                              <strong>{t('admin.health.database_error')}</strong> {route.dataWiring.error}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            {t('admin.health.about_this_dashboard')}
          </h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>
              {t('admin.health.about_description')}
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>{t('admin.health.route_access')}:</strong> {t('admin.health.route_access_test_desc')}</li>
              <li><strong>{t('admin.health.runtime_render')}:</strong> {t('admin.health.runtime_render_test_desc')}</li>
              <li><strong>{t('admin.health.data_wiring')}:</strong> {t('admin.health.data_wiring_test_desc')}</li>
              <li><strong>{t('admin.health.root_cause_analysis_desc')}</strong></li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {t('admin.health.status_legend')}
          </h3>
          <div className="text-green-800 space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <strong>{t('admin.health.green_ok')}</strong> {t('admin.health.green_ok_desc')}
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <strong>{t('admin.health.yellow_warning')}</strong> {t('admin.health.yellow_warning_desc')}
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <strong>{t('admin.health.red_error')}</strong> {t('admin.health.red_error_desc')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          {t('admin.health.common_issues')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-semibold mb-1">{t('admin.health.runtime_errors')}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t('admin.health.not_defined')}</li>
              <li>{t('admin.health.cannot_read')}</li>
              <li>{t('admin.health.not_a_function')}</li>
              <li>{t('admin.health.react_error_boundary')}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">{t('admin.health.data_errors')}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t('admin.health.db_connection')}</li>
              <li>{t('admin.health.missing_tables')}</li>
              <li>{t('admin.health.rls_issues')}</li>
              <li>{t('admin.health.query_timeout')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHealthPage;

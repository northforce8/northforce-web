import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { ADMIN_ROUTES } from '../../lib/admin-routes';
import { logAdminError } from '../../lib/admin-error-logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  route: string;
  errorId: string | null;
}

class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      route: window.location.pathname,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      route: window.location.pathname,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = logAdminError(error, {
      route: window.location.pathname,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
      route: window.location.pathname,
      errorId,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = ADMIN_ROUTES.DASHBOARD;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Fel uppstod
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Något gick fel i administratörsgränssnittet
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-semibold text-red-900 mb-2">
                  Feldetaljer:
                </h2>
                <div className="space-y-2">
                  {this.state.errorId && (
                    <div className="text-sm">
                      <span className="font-medium text-red-900">Fel-ID:</span>
                      <span className="ml-2 text-red-700 font-mono font-bold">
                        {this.state.errorId}
                      </span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-medium text-red-900">Rutt:</span>
                    <span className="ml-2 text-red-700 font-mono">
                      {this.state.route}
                    </span>
                  </div>
                  {this.state.error && (
                    <div className="text-sm">
                      <span className="font-medium text-red-900">Meddelande:</span>
                      <span className="ml-2 text-red-700">
                        {this.state.error.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {this.state.errorInfo && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Tekniska detaljer (Klicka för att expandera)
                  </summary>
                  <div className="mt-3 p-4 bg-gray-100 rounded border border-gray-200 overflow-auto max-h-64">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  <RefreshCw className="h-5 w-5" />
                  Ladda om sidan
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  <Home className="h-5 w-5" />
                  Gå till instrumentpanelen
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Om felet kvarstår, kontakta support och inkludera{' '}
                  <strong>Fel-ID</strong> ovan för snabbare lösning.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;

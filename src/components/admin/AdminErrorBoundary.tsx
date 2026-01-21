import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check } from 'lucide-react';
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
  language: string;
  userAgent: string;
  timestamp: string;
  copied: boolean;
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
      language: localStorage.getItem('language') || 'en',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      route: window.location.pathname,
      language: localStorage.getItem('language') || 'en',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = logAdminError(error, {
      route: window.location.pathname,
      componentStack: errorInfo.componentStack,
      language: localStorage.getItem('language') || 'en',
      userAgent: navigator.userAgent,
    });

    console.error('=== ADMIN PORTAL ERROR CAPTURED ===');
    console.error('Error ID:', errorId);
    console.error('Route:', window.location.pathname);
    console.error('Language:', localStorage.getItem('language'));
    console.error('Error:', error);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('===================================');

    this.setState({
      error,
      errorInfo,
      route: window.location.pathname,
      errorId,
    });
  }

  copyErrorDetails = () => {
    const errorDetails = `
=== ADMIN PORTAL ERROR REPORT ===
Error ID: ${this.state.errorId || 'N/A'}
Timestamp: ${this.state.timestamp}
Route: ${this.state.route}
Language: ${this.state.language}
User Agent: ${this.state.userAgent}

Error Message: ${this.state.error?.message || 'Unknown'}

Error Stack:
${this.state.error?.stack || 'No stack trace available'}

Component Stack:
${this.state.errorInfo?.componentStack || 'No component stack available'}

Build: 2025.01.15-1411
===================================
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = ADMIN_ROUTES.DASHBOARD;
  };

render() {
if (this.state.hasError) {
    if (import.meta.env.PROD) {
        // Inget UI visas i produktion, gör ingen rendering
        return null;
    }
    // Annars, rendera normalt i devläge (det här gör inget om det inte är produktion)
    return this.props.children;
}

}


        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Admin UI Crashed - White Screen Captured
                  </h1>
                  <p className="text-gray-600 mt-1">
                    This error prevented the admin portal from rendering
                  </p>
                </div>
                <button
                  onClick={this.copyErrorDetails}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Report
                    </>
                  )}
                </button>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 mb-6">
                <h2 className="text-base font-bold text-red-900 mb-3 uppercase tracking-wide">
                  Error Details
                </h2>
                <div className="space-y-3">
                  {this.state.errorId && (
                    <div className="text-sm">
                      <span className="font-bold text-red-900">Error ID:</span>
                      <span className="ml-2 text-red-700 font-mono font-bold text-base">
                        {this.state.errorId}
                      </span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-bold text-red-900">Route:</span>
                    <span className="ml-2 text-red-700 font-mono">
                      {this.state.route}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-red-900">Language:</span>
                    <span className="ml-2 text-red-700 font-mono">
                      {this.state.language}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-red-900">Timestamp:</span>
                    <span className="ml-2 text-red-700 font-mono">
                      {this.state.timestamp}
                    </span>
                  </div>
                  {this.state.error && (
                    <div className="text-sm">
                      <span className="font-bold text-red-900">Message:</span>
                      <div className="ml-2 mt-1 text-red-700 font-medium bg-red-100 p-3 rounded border border-red-200">
                        {this.state.error.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {this.state.error?.stack && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Error Stack Trace (First 30 Lines)
                  </h3>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 overflow-auto max-h-80">
                    <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
                      {this.state.error.stack.split('\n').slice(0, 30).join('\n')}
                    </pre>
                  </div>
                </div>
              )}

              {this.state.errorInfo?.componentStack && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Component Stack (First 30 Lines)
                  </h3>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 overflow-auto max-h-80">
                    <pre className="text-xs text-yellow-400 whitespace-pre-wrap font-mono">
                      {this.state.errorInfo.componentStack.split('\n').slice(0, 30).join('\n')}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <RefreshCw className="h-5 w-5" />
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  <Home className="h-5 w-5" />
                  Go to Dashboard
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    Build Version: 2025.01.15-1411
                  </p>
                  <p className="text-sm text-blue-800">
                    This error screen replaces the white screen and captures diagnostic information.
                    Click "Copy Report" above to share the complete error details.
                  </p>
                </div>
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

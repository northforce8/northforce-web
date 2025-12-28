import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInAdmin } from '../../lib/auth';
import { Shield, Eye, EyeOff, Zap, AlertTriangle } from 'lucide-react';
import { ADMIN_ROUTES } from '../../lib/admin-routes';
import { getMissingEnvVars } from '../../lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState<string[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  const missing = getMissingEnvVars();

  // Visa konfig-fel endast i lokal/dev – inte i production
  if (import.meta.env.DEV && missing.length > 0) {
    setConfigError(missing);
  }
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const admin = await signInAdmin(email, password);

      if (admin) {
        navigate(ADMIN_ROUTES.DASHBOARD);
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-glow p-8">
          <div className="text-center mb-8">
            <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-3xl font-black text-gray-900 tracking-tight">Admin Login</h1>
            <p className="text-gray-600 mt-2">Access NorthForce Admin Panel</p>
          </div>

          {configError.length > 0 && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 mb-2">Configuration Error</h3>
                  <p className="text-red-800 text-sm mb-3">
                    Missing required environment variables in production:
                  </p>
                  <ul className="list-disc list-inside text-red-700 text-sm space-y-1 mb-3">
                    {configError.map(varName => (
                      <li key={varName} className="font-mono">{varName}</li>
                    ))}
                  </ul>
                  <p className="text-red-800 text-sm font-medium">
                    Please configure these in your deployment platform (Netlify).
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={configError.length > 0}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="admin@northforce.io"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={configError.length > 0}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={configError.length > 0}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
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
              disabled={isLoading || configError.length > 0}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-3 rounded-lg hover:shadow-glow transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              to="/admin/setup"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <Zap className="h-4 w-4" />
              First time? Run initial setup
            </Link>
            <p className="text-sm text-gray-500">
              Secure admin access for NorthForce team members only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

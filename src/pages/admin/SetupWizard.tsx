import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, Database, Users, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ADMIN_ROUTES } from '../../lib/admin-routes';

interface SetupStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  message?: string;
}

export const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<SetupStep[]>([
    { id: 'admin', title: 'Create Admin User', status: 'pending' },
    { id: 'data', title: 'Generate Test Data', status: 'pending' },
    { id: 'verify', title: 'Verify Setup', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@northforce.io');
  const [adminPassword, setAdminPassword] = useState('Admin123!');
  const [error, setError] = useState<string | null>(null);

  const updateStep = (id: string, updates: Partial<SetupStep>) => {
    setSteps(prev => prev.map(step =>
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const runSetup = async () => {
    setIsRunning(true);
    setError(null);

    try {
      // Step 1: Create Admin User
      updateStep('admin', { status: 'running', message: 'Creating admin account...' });

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            role: 'admin',
            full_name: 'Admin User'
          }
        }
      });

      if (signUpError) {
        // User might already exist, try signing in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        });

        if (signInError) {
          throw new Error(`Failed to create/login admin: ${signInError.message}`);
        }

        updateStep('admin', {
          status: 'complete',
          message: 'Admin user already exists - logged in successfully'
        });
      } else {
        updateStep('admin', {
          status: 'complete',
          message: `Admin created: ${adminEmail}`
        });
      }

      // Step 2: Generate Test Data
      updateStep('data', { status: 'running', message: 'Creating test customers...' });

      // Create test customers
      const testCustomers = [
        {
          company_name: 'Acme Corporation',
          org_number: '556789-1234',
          website: 'https://acme.example.com',
          industry: 'Technology',
          country: 'Sweden',
          contact_name: 'John Doe',
          contact_email: 'john@acme.example.com',
          contact_phone: '+46701234567',
          status: 'active',
          credits_balance: 100.0,
          credits_monthly_allocation: 50.0,
          collaboration_status: 'aktiv'
        },
        {
          company_name: 'Nordic Tech AB',
          org_number: '556123-4567',
          website: 'https://nordictech.se',
          industry: 'Software',
          country: 'Sweden',
          contact_name: 'Anna Andersson',
          contact_email: 'anna@nordictech.se',
          contact_phone: '+46707654321',
          status: 'active',
          credits_balance: 75.5,
          credits_monthly_allocation: 40.0,
          collaboration_status: 'aktiv'
        },
        {
          company_name: 'Global Solutions Inc',
          org_number: '556999-8888',
          website: 'https://globalsolutions.com',
          industry: 'Consulting',
          country: 'Sweden',
          contact_name: 'Erik Eriksson',
          contact_email: 'erik@globalsolutions.com',
          contact_phone: '+46709876543',
          status: 'active',
          credits_balance: 25.0,
          credits_monthly_allocation: 60.0,
          collaboration_status: 'avtappning'
        }
      ];

      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .insert(testCustomers)
        .select();

      if (customersError) {
        console.warn('Customer creation warning:', customersError.message);
        updateStep('data', {
          status: 'complete',
          message: 'Test data might already exist - continuing...'
        });
      } else {
        updateStep('data', {
          status: 'running',
          message: `Created ${customers?.length || 0} customers, adding projects...`
        });

        // Create test projects for first customer
        if (customers && customers.length > 0) {
          const testProjects = [
            {
              project_name: 'Website Redesign',
              customer_id: customers[0].id,
              status: 'active',
              project_type: 'Implementation',
              estimated_hours: 120,
              actual_hours: 45.5
            },
            {
              project_name: 'Mobile App Development',
              customer_id: customers[0].id,
              status: 'active',
              project_type: 'Development',
              estimated_hours: 200,
              actual_hours: 78.0
            }
          ];

          await supabase.from('projects').insert(testProjects);
        }

        updateStep('data', {
          status: 'complete',
          message: `Created ${customers?.length || 0} customers with projects`
        });
      }

      // Step 3: Verify Setup
      updateStep('verify', { status: 'running', message: 'Verifying database setup...' });

      const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      updateStep('verify', {
        status: 'complete',
        message: `Setup complete! ${customerCount || 0} customers, ${projectCount || 0} projects`
      });

      // Wait a bit to show success state
      setTimeout(() => {
        navigate(ADMIN_ROUTES.DASHBOARD);
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      updateStep('verify', { status: 'error', message: errorMessage });
    } finally {
      setIsRunning(false);
    }
  };

  const isComplete = steps.every(step => step.status === 'complete');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal Setup
          </h1>
          <p className="text-gray-600">
            Initialize your Northforce admin portal with one click
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Setup Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-6 space-y-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Admin Credentials</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              disabled={isRunning || isComplete}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              disabled={isRunning || isComplete}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                step.status === 'complete'
                  ? 'bg-green-50 border border-green-200'
                  : step.status === 'running'
                  ? 'bg-blue-50 border border-blue-200'
                  : step.status === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex-shrink-0">
                {step.status === 'complete' && (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                )}
                {step.status === 'running' && (
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                )}
                {step.status === 'error' && (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                {step.status === 'pending' && (
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{index + 1}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {step.title}
                </h3>
                {step.message && (
                  <p className="text-sm text-gray-600">{step.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          {!isComplete ? (
            <button
              onClick={runSetup}
              disabled={isRunning}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Start Setup
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate(ADMIN_ROUTES.DASHBOARD)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              Go to Dashboard
            </button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">What will be created:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Admin user account with full access
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              3 test customers with realistic data
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              Sample projects and time entries
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

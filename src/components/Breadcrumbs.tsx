import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumbs = () => { // Breadcrumbs component
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbLabel = (pathname: string): string => {
    const labels: { [key: string]: string } = {
      'systems': 'Systems',
      'services': 'Services',
      'solutions': 'Solutions',
      'cmo-plus-system': 'CMO + System',
      'method': 'Method',
      'industries': 'Industries',
      'proof': 'Proof',
      'pricing': 'Pricing',
      'insights': 'Insights',
      'contact': 'Contact',
      'audit': 'Free Audit',
      'about': 'About',
      'careers': 'Careers',
      'legal': 'Legal',
      'admin-northforce': 'Admin Dashboard',
      'admin-login': 'Admin Login'
    };
    return labels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...pathnames.map((pathname, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        label: getBreadcrumbLabel(pathname),
        href: index === pathnames.length - 1 ? undefined : href
      };
    })
  ];

  // Don't show breadcrumbs on home page or if only one level deep
  if (pathnames.length === 0 || pathnames.length === 1) {
    return null;
  }

  return (
    <nav className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}
              {breadcrumb.href ? (
                <Link
                  to={breadcrumb.href}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium flex items-center"
                >
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold flex items-center">
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {breadcrumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
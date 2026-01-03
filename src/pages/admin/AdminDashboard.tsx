import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search, Filter, Eye, Sparkles } from 'lucide-react';
import { isAdminAuthenticated } from '../../lib/auth';
import { getAllSubmissions, getLeadClassification } from '../../lib/supabase';
import type { ContactSubmission, BookingSubmission, NewsletterSubmission, LeadStatus, LeadType } from '../../lib/supabase';
import { buildLeadDetailRoute } from '../../lib/admin-routes';
import { PageHeader } from '../../components/admin/PageHeader';

type AllSubmissions = {
  contact: ContactSubmission[];
  booking: BookingSubmission[];
  newsletter: NewsletterSubmission[];
};

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<AllSubmissions>({ contact: [], booking: [], newsletter: [] });
  const [filteredSubmissions, setFilteredSubmissions] = useState<AllSubmissions>({ contact: [], booking: [], newsletter: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'booking' | 'newsletter'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | LeadStatus>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | BookingSubmission | NewsletterSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [classifications, setClassifications] = useState<Map<string, any>>(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAdminAuthenticated();
        if (!isAuth) {
          navigate('/admin-login');
          return;
        }

        const allSubmissions = await getAllSubmissions();
        setSubmissions(allSubmissions);
        setFilteredSubmissions(allSubmissions);
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    let filtered = { ...submissions };

    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered.contact = submissions.contact.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm) ||
        sub.email.toLowerCase().includes(searchTerm) ||
        sub.company.toLowerCase().includes(searchTerm)
      );
      filtered.booking = submissions.booking.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm) ||
        sub.email.toLowerCase().includes(searchTerm) ||
        (sub.company && sub.company.toLowerCase().includes(searchTerm))
      );
      filtered.newsletter = submissions.newsletter.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered.contact = filtered.contact.filter(sub => sub.status === filterStatus);
      filtered.booking = filtered.booking.filter(sub => sub.status === filterStatus);
      filtered.newsletter = filtered.newsletter.filter(sub => sub.status === filterStatus);
    }

    if (filterType !== 'all') {
      const emptyResult = { contact: [], booking: [], newsletter: [] };
      filtered = {
        ...emptyResult,
        [filterType]: filtered[filterType]
      };
    }

    setFilteredSubmissions(filtered);
  }, [searchQuery, filterType, filterStatus, submissions]);

  const handleExportCSV = () => {
    const allSubs = [
      ...filteredSubmissions.contact.map(sub => ({ ...sub, type: 'contact' as LeadType })),
      ...filteredSubmissions.booking.map(sub => ({ ...sub, type: 'booking' as LeadType })),
      ...filteredSubmissions.newsletter.map(sub => ({ ...sub, type: 'newsletter' as LeadType }))
    ];

    const headers = ['Type', 'Status', 'Name', 'Email', 'Company', 'Submitted At', 'Details'];
    const rows = allSubs.map(sub => {
      const baseData = [
        sub.type,
        sub.status,
        sub.type === 'newsletter' ? '' : (sub as ContactSubmission | BookingSubmission).name,
        sub.email,
        sub.type === 'contact' ? (sub as ContactSubmission).company :
        sub.type === 'booking' ? ((sub as BookingSubmission).company || '') : '',
        new Date(sub.created_at).toLocaleString(),
        sub.type === 'contact' ? (sub as ContactSubmission).challenge :
        sub.type === 'booking' ? `${(sub as BookingSubmission).meeting_type} min meeting` : 'Newsletter signup'
      ];
      return baseData.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `northforce-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const allSubs = [
      ...filteredSubmissions.contact.map(sub => ({ ...sub, type: 'contact' as LeadType })),
      ...filteredSubmissions.booking.map(sub => ({ ...sub, type: 'booking' as LeadType })),
      ...filteredSubmissions.newsletter.map(sub => ({ ...sub, type: 'newsletter' as LeadType }))
    ];

    let excelContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table{border-collapse:collapse;}td,th{border:1px solid #ddd;padding:8px;}th{background-color:#0066cc;color:white;}</style></head><body><table>';

    excelContent += '<tr><th>Type</th><th>Status</th><th>Name</th><th>Email</th><th>Company</th><th>Submitted At</th><th>Details</th></tr>';

    allSubs.forEach(sub => {
      excelContent += '<tr>';
      excelContent += `<td>${sub.type}</td>`;
      excelContent += `<td>${sub.status}</td>`;
      excelContent += `<td>${sub.type === 'newsletter' ? '' : (sub as ContactSubmission | BookingSubmission).name}</td>`;
      excelContent += `<td>${sub.email}</td>`;
      excelContent += `<td>${sub.type === 'contact' ? (sub as ContactSubmission).company : sub.type === 'booking' ? ((sub as BookingSubmission).company || '') : ''}</td>`;
      excelContent += `<td>${new Date(sub.created_at).toLocaleString()}</td>`;
      excelContent += `<td>${sub.type === 'contact' ? (sub as ContactSubmission).challenge : sub.type === 'booking' ? `${(sub as BookingSubmission).meeting_type} min meeting` : 'Newsletter signup'}</td>`;
      excelContent += '</tr>';
    });

    excelContent += '</table></body></html>';

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `northforce-leads-${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getSubmissionStats = () => {
    const contact = submissions.contact.length;
    const booking = submissions.booking.length;
    const newsletter = submissions.newsletter.length;
    const total = contact + booking + newsletter;
    
    return { total, contact, booking, newsletter };
  };

  const getAllSubmissionsFlat = () => {
    return [
      ...filteredSubmissions.contact.map(sub => ({ ...sub, type: 'contact' })),
      ...filteredSubmissions.booking.map(sub => ({ ...sub, type: 'booking' })),
      ...filteredSubmissions.newsletter.map(sub => ({ ...sub, type: 'newsletter' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const stats = getSubmissionStats();
  const flatSubmissions = getAllSubmissionsFlat();

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Lead Management"
          description="Enterprise-grade lead management with AI classification and customer linking"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-accent-cyan"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contact Forms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contact}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-accent-emerald"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.booking}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-accent-amber"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Newsletter</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newsletter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative"> {/* Search input */}
                  <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                
                <div className="relative"> {/* Filter select */}
                  <Filter className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'contact' | 'booking' | 'newsletter')}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="all">All Types</option>
                    <option value="contact">Contact Forms</option>
                    <option value="booking">Bookings</option>
                    <option value="newsletter">Newsletter</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | LeadStatus)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="qualified">Qualified</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center px-4 py-2 bg-accent-emerald text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </button>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flatSubmissions.map((submission) => {
                  const leadType = ('type' in submission ? submission.type : 'contact') as LeadType;
                  const detailRoute = buildLeadDetailRoute(leadType, submission.id);
                  return (
                    <tr key={submission.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(detailRoute)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          leadType === 'contact' ? 'bg-blue-100 text-blue-800' :
                          leadType === 'booking' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {leadType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          submission.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          submission.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          submission.status === 'qualified' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {leadType === 'newsletter' ? submission.email : ('name' in submission ? submission.name : '')}
                        </div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leadType === 'contact' ? ('company' in submission ? submission.company : '-') :
                         leadType === 'booking' ? ('company' in submission ? submission.company || '-' : '-') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(detailRoute)}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Open
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {('type' in selectedSubmission ? String(selectedSubmission.type).charAt(0).toUpperCase() + String(selectedSubmission.type).slice(1) : 'Unknown')} Submission
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{selectedSubmission.email}</dd>
                </div>
                {('type' in selectedSubmission && selectedSubmission.type) !== 'newsletter' && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{'name' in selectedSubmission ? selectedSubmission.name : ''}</dd>
                  </div>
                )}
                {('type' in selectedSubmission && selectedSubmission.type) === 'contact' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Company</dt>
                      <dd className="text-sm text-gray-900">{'company' in selectedSubmission ? selectedSubmission.company : ''}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Industry</dt>
                      <dd className="text-sm text-gray-900">{'industry' in selectedSubmission ? selectedSubmission.industry : ''}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Challenge</dt>
                      <dd className="text-sm text-gray-900">{'challenge' in selectedSubmission ? selectedSubmission.challenge : ''}</dd>
                    </div>
                    {('message' in selectedSubmission && selectedSubmission.message) && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Message</dt>
                        <dd className="text-sm text-gray-900">{'message' in selectedSubmission ? selectedSubmission.message : ''}</dd>
                      </div>
                    )}
                  </>
                )}
                {('type' in selectedSubmission && selectedSubmission.type) === 'booking' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Meeting Type</dt>
                      <dd className="text-sm text-gray-900">{'meeting_type' in selectedSubmission ? selectedSubmission.meeting_type : ''} minutes</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Preferred Date & Time</dt>
                      <dd className="text-sm text-gray-900">
                        {'preferred_date' in selectedSubmission ? selectedSubmission.preferred_date : ''} at {'preferred_time' in selectedSubmission ? selectedSubmission.preferred_time : ''}
                      </dd>
                    </div>
                  </>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Submitted At</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
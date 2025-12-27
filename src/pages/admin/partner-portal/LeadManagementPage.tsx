import React, { useState, useEffect } from 'react';
import { Mail, Calendar as CalendarIcon, Newspaper, Users, Star, TrendingUp, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { buildLeadDetailRoute } from '../../../lib/admin-routes';

interface Lead {
  id: string;
  type: 'contact' | 'booking' | 'newsletter';
  name?: string;
  email: string;
  company?: string;
  status: string;
  created_at: string;
  classification?: {
    classification: string;
    confidence_score: number;
  };
  customer_link?: {
    customer: {
      company_name: string;
    };
  };
}

const LeadManagementPage: React.FC = () => {
  const [contacts, setContacts] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Lead[]>([]);
  const [newsletters, setNewsletters] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'contact' | 'booking' | 'newsletter'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const [contactsRes, bookingsRes, newslettersRes] = await Promise.all([
        supabase.from('contact_submissions').select(`
          *,
          classification:lead_classifications!lead_classifications_lead_id_fkey(
            classification,
            confidence_score
          ),
          customer_link:lead_customer_links!lead_customer_links_lead_id_fkey(
            customer:customers(company_name)
          )
        `).order('created_at', { ascending: false }),
        supabase.from('booking_submissions').select(`
          *,
          classification:lead_classifications!lead_classifications_lead_id_fkey(
            classification,
            confidence_score
          ),
          customer_link:lead_customer_links!lead_customer_links_lead_id_fkey(
            customer:customers(company_name)
          )
        `).order('created_at', { ascending: false }),
        supabase.from('newsletter_submissions').select(`
          *,
          classification:lead_classifications!lead_classifications_lead_id_fkey(
            classification,
            confidence_score
          ),
          customer_link:lead_customer_links!lead_customer_links_lead_id_fkey(
            customer:customers(company_name)
          )
        `).order('created_at', { ascending: false }),
      ]);

      setContacts((contactsRes.data || []).map(c => ({ ...c, type: 'contact' as const })));
      setBookings((bookingsRes.data || []).map(b => ({ ...b, type: 'booking' as const })));
      setNewsletters((newslettersRes.data || []).map(n => ({ ...n, type: 'newsletter' as const })));
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const allLeads = [...contacts, ...bookings, ...newsletters];

  const getLeadsForTab = () => {
    switch (activeTab) {
      case 'contact': return contacts;
      case 'booking': return bookings;
      case 'newsletter': return newsletters;
      default: return allLeads;
    }
  };

  const filteredLeads = getLeadsForTab().filter(lead => {
    const matchesSearch =
      (lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'high_potential': return 'text-green-600';
      case 'medium_potential': return 'text-yellow-600';
      case 'low_potential': return 'text-orange-600';
      case 'not_relevant': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const stats = {
    total: allLeads.length,
    new: allLeads.filter(l => l.status === 'new').length,
    qualified: allLeads.filter(l => l.status === 'qualified').length,
    converted: allLeads.filter(l => l.customer_link).length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
        <p className="text-gray-600 mt-1">Manage and qualify incoming leads from all sources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-900">{stats.new}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Qualified</p>
              <p className="text-2xl font-bold text-green-900">{stats.qualified}</p>
            </div>
            <Star className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-purple-900">{stats.converted}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Leads ({allLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'contact'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'booking'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'newsletter'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Newsletter ({newsletters.length})
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="qualified">Qualified</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  AI Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={`${lead.type}-${lead.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {lead.type === 'contact' && <Mail className="h-4 w-4 text-blue-500 mr-2" />}
                      {lead.type === 'booking' && <CalendarIcon className="h-4 w-4 text-purple-500 mr-2" />}
                      {lead.type === 'newsletter' && <Newspaper className="h-4 w-4 text-green-500 mr-2" />}
                      <span className="text-sm text-gray-900 capitalize">{lead.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{lead.name || lead.email}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{lead.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.classification ? (
                      <div>
                        <div className={`text-sm font-medium ${getClassificationColor(lead.classification.classification)}`}>
                          {lead.classification.classification.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(lead.classification.confidence_score * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not classified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {lead.customer_link?.customer ? (
                      <span className="text-sm text-green-600 font-medium">
                        {lead.customer_link.customer.company_name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not linked</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={buildLeadDetailRoute(lead.type, lead.id)}
                      className="text-primary-600 hover:text-primary-900 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagementPage;

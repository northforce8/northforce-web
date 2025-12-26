import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Mail, Phone, Globe, Edit2, Save, X, Check,
  FolderKanban, Users, Coins, TrendingUp, AlertTriangle, Plus,
  Calendar, Clock, FileText, DollarSign, Activity, Target, Zap,
  TrendingDown, Sparkles, ChevronDown, ChevronUp, BarChart3,
  AlertCircle, CheckCircle2, XCircle, Info
} from 'lucide-react';
import { isAdmin } from '../../../lib/auth';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import type {
  Customer, Project, Partner, TimeEntryWithRelations,
  CreditsTransactionWithRelations, NoteWithRelations
} from '../../../lib/partner-portal-types';
import { PlanPricingCard } from '../../../components/admin/CreditsWithMoneyDisplay';
import { creditsToMoney, formatCurrency as formatCurrencyUtil, getPlanDetails } from '../../../lib/credits-pricing-config';
import CustomerHealthAI from '../../../components/admin/CustomerHealthAI';

interface TimelineEvent {
  id: string;
  type: 'time_entry' | 'credit_transaction' | 'note' | 'project_change' | 'customer_update';
  timestamp: string;
  title: string;
  description: string;
  metadata?: any;
  icon: React.ReactNode;
  color: string;
}

const CustomerDetailPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithRelations[]>([]);
  const [transactions, setTransactions] = useState<CreditsTransactionWithRelations[]>([]);
  const [notes, setNotes] = useState<NoteWithRelations[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    burnRate: true,
    margin: true,
    timeline: true,
    projects: true,
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Partial<Customer>>({});

  const [creditsForm, setCreditsForm] = useState({
    monthly_allocation: 0,
    balance_adjustment: 0,
    monthly_recurring_revenue: 0,
    price_per_credit: 0,
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    workstream: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    start_date: '',
    end_date: '',
    expected_credits_per_period: 0,
  });

  const [newNote, setNewNote] = useState({
    content: '',
    note_type: 'general',
    visibility: 'shared' as 'admin_only' | 'shared',
  });

  useEffect(() => {
    loadData();
  }, [customerId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadData = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError(null);
      const userIsAdmin = await isAdmin();
      setIsAdminUser(userIsAdmin);

      const [customerData, projectsData, partnersData, timeData, transactionsData, notesData] = await Promise.all([
        partnerPortalApi.customers.getById(customerId),
        partnerPortalApi.projects.getAll(),
        partnerPortalApi.partners.getAll(),
        partnerPortalApi.timeEntries.getAll({ customerId }),
        partnerPortalApi.credits.getTransactions(customerId),
        partnerPortalApi.notes.getAll(),
      ]);

      if (!customerData) {
        setError('Customer not found');
        return;
      }

      setCustomer(customerData);
      setFieldValues(customerData);
      setCreditsForm({
        monthly_allocation: customerData.credits_monthly_allocation || 0,
        balance_adjustment: 0,
        monthly_recurring_revenue: customerData.monthly_recurring_revenue || 0,
        price_per_credit: customerData.credits_price_per_credit || 1500,
      });

      const customerProjects = projectsData.filter(p => p.customer_id === customerId);
      setProjects(customerProjects);
      setPartners(partnersData);
      setTimeEntries(timeData);
      setTransactions(transactionsData);
      setNotes(notesData.filter(n => n.customer_id === customerId));
    } catch (error) {
      console.error('Error loading customer details:', error);
      setError('Failed to load customer details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInlineFieldUpdate = async (fieldName: keyof Customer, value: any) => {
    if (!customer || !customerId) return;

    setSubmitting(true);
    setError(null);

    try {
      await partnerPortalApi.customers.update(customerId, { [fieldName]: value });
      setEditingField(null);
      setSuccess(`${fieldName.replace(/_/g, ' ')} updated successfully`);
      await loadData();
    } catch (error) {
      console.error('Error updating field:', error);
      setError(`Failed to update ${fieldName.replace(/_/g, ' ')}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !customerId) return;

    setSubmitting(true);
    setError(null);

    try {
      const updates: Partial<Customer> = {
        credits_monthly_allocation: creditsForm.monthly_allocation,
        monthly_recurring_revenue: creditsForm.monthly_recurring_revenue,
        credits_price_per_credit: creditsForm.price_per_credit,
      };

      if (creditsForm.balance_adjustment !== 0) {
        updates.credits_balance = (customer.credits_balance || 0) + creditsForm.balance_adjustment;

        await partnerPortalApi.credits.createTransaction({
          customer_id: customerId,
          transaction_type: creditsForm.balance_adjustment > 0 ? 'allocation' : 'adjustment',
          amount: creditsForm.balance_adjustment,
          balance_after: updates.credits_balance,
          reason: `Manual adjustment: ${creditsForm.balance_adjustment > 0 ? 'Credits added' : 'Credits deducted'}`,
        });
      }

      await partnerPortalApi.customers.update(customerId, updates);

      setShowCreditsModal(false);
      setCreditsForm(prev => ({ ...prev, balance_adjustment: 0 }));
      setSuccess('Credits updated successfully');
      await loadData();
    } catch (error) {
      console.error('Error updating credits:', error);
      setError('Failed to update credits. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;

    setSubmitting(true);
    setError(null);

    try {
      await partnerPortalApi.projects.create({
        ...newProject,
        customer_id: customerId,
        start_date: newProject.start_date || undefined,
        end_date: newProject.end_date || undefined,
        expected_credits_per_period: newProject.expected_credits_per_period || undefined,
      });

      setShowAddProjectModal(false);
      setNewProject({
        name: '',
        description: '',
        workstream: '',
        status: 'planning',
        priority: 'medium',
        start_date: '',
        end_date: '',
        expected_credits_per_period: 0,
      });
      setSuccess('Project created successfully');
      await loadData();
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;

    setSubmitting(true);
    setError(null);

    try {
      await partnerPortalApi.notes.create({
        customer_id: customerId,
        content: newNote.content,
        note_type: newNote.note_type,
        visibility: newNote.visibility,
      });

      setShowAddNoteModal(false);
      setNewNote({
        content: '',
        note_type: 'general',
        visibility: 'shared',
      });
      setSuccess('Note created successfully');
      await loadData();
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getThisMonthData = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= firstDayOfMonth;
    });

    const totalHours = thisMonthEntries.reduce((sum, e) => sum + Number(e.hours), 0);
    const totalCredits = thisMonthEntries.reduce((sum, e) => sum + Number(e.credits_consumed || 0), 0);
    const totalCost = thisMonthEntries.reduce((sum, e) => sum + Number(e.internal_cost || 0), 0);

    return { totalHours, totalCredits, totalCost, entries: thisMonthEntries };
  };

  const calculateBurnRate = () => {
    const thisMonthData = getThisMonthData();
    const daysIntoMonth = new Date().getDate();
    const dailyBurnRate = daysIntoMonth > 0 ? thisMonthData.totalCredits / daysIntoMonth : 0;

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const projectedMonthlyBurn = dailyBurnRate * daysInMonth;
    const daysRemaining = daysInMonth - daysIntoMonth;
    const projectedRemainingBurn = dailyBurnRate * daysRemaining;

    return {
      daily: dailyBurnRate,
      projected: projectedMonthlyBurn,
      current: thisMonthData.totalCredits,
      remaining: projectedRemainingBurn,
      daysRemaining,
    };
  };

  const calculateMargin = () => {
    const thisMonthData = getThisMonthData();
    const pricePerCredit = customer?.credits_price_per_credit || 1500;
    const revenue = thisMonthData.totalCredits * pricePerCredit;
    const margin = revenue - thisMonthData.totalCost;
    const marginPercentage = revenue > 0 ? (margin / revenue) * 100 : 0;

    return {
      revenue,
      cost: thisMonthData.totalCost,
      margin,
      marginPercentage,
    };
  };

  const generateAIStatusSummary = (): string => {
    if (!customer) return '';

    const burnRate = calculateBurnRate();
    const marginData = calculateMargin();
    const creditsRemaining = customer.credits_balance || 0;
    const utilization = customer.credits_monthly_allocation
      ? (burnRate.projected / customer.credits_monthly_allocation) * 100
      : 0;

    const parts: string[] = [];

    if (utilization > 100) {
      parts.push(`⚠️ Projected to exceed allocation by ${(utilization - 100).toFixed(0)}%`);
    } else if (utilization > 90) {
      parts.push(`⚡ High utilization at ${utilization.toFixed(0)}%`);
    } else if (utilization < 50) {
      parts.push(`📊 Low utilization at ${utilization.toFixed(0)}%`);
    } else {
      parts.push(`✓ On track at ${utilization.toFixed(0)}% utilization`);
    }

    if (marginData.marginPercentage < 20) {
      parts.push(`margin at risk (${marginData.marginPercentage.toFixed(0)}%)`);
    } else if (marginData.marginPercentage > 40) {
      parts.push(`healthy margin (${marginData.marginPercentage.toFixed(0)}%)`);
    }

    if (creditsRemaining < burnRate.remaining) {
      parts.push(`insufficient balance for period`);
    }

    const activeProjects = projects.filter(p => p.status === 'active').length;
    if (activeProjects > 0) {
      parts.push(`${activeProjects} active project${activeProjects > 1 ? 's' : ''}`);
    }

    return parts.join(', ');
  };

  const buildTimeline = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    timeEntries.forEach(entry => {
      events.push({
        id: `time-${entry.id}`,
        type: 'time_entry',
        timestamp: entry.date,
        title: `${Number(entry.hours).toFixed(1)}h logged`,
        description: `${entry.description} (${Number(entry.credits_consumed || 0).toFixed(1)} credits)`,
        metadata: entry,
        icon: <Clock className="h-4 w-4" />,
        color: 'text-blue-600',
      });
    });

    transactions.forEach(tx => {
      events.push({
        id: `tx-${tx.id}`,
        type: 'credit_transaction',
        timestamp: tx.created_at,
        title: `Credits ${tx.transaction_type}`,
        description: `${Number(tx.amount) > 0 ? '+' : ''}${Number(tx.amount).toFixed(1)} credits (${tx.reason || 'No reason provided'})`,
        metadata: tx,
        icon: <Coins className="h-4 w-4" />,
        color: Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600',
      });
    });

    notes.forEach(note => {
      events.push({
        id: `note-${note.id}`,
        type: 'note',
        timestamp: note.created_at,
        title: `Note: ${note.note_type}`,
        description: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
        metadata: note,
        icon: <FileText className="h-4 w-4" />,
        color: 'text-gray-600',
      });
    });

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getFinancialHealthScore = (): { score: number; status: string; color: string } => {
    const burnRate = calculateBurnRate();
    const marginData = calculateMargin();
    const utilization = customer?.credits_monthly_allocation
      ? (burnRate.projected / customer.credits_monthly_allocation) * 100
      : 0;

    let score = 100;

    if (utilization > 100) score -= 30;
    else if (utilization > 90) score -= 20;
    else if (utilization < 50) score -= 10;

    if (marginData.marginPercentage < 20) score -= 30;
    else if (marginData.marginPercentage < 30) score -= 15;

    const creditsRemaining = customer?.credits_balance || 0;
    if (creditsRemaining < burnRate.remaining) score -= 20;
    else if (creditsRemaining < burnRate.remaining * 1.5) score -= 10;

    if (score >= 80) return { score, status: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { score, status: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { score, status: 'At Risk', color: 'text-yellow-600' };
    return { score, status: 'Critical', color: 'text-red-600' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Not Found</h3>
            <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/admin/partner-portal/customers')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Customers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const thisMonthData = getThisMonthData();
  const burnRate = calculateBurnRate();
  const marginData = calculateMargin();
  const creditsRemaining = customer.credits_balance || 0;
  const creditsPercentage = customer.credits_monthly_allocation
    ? (creditsRemaining / customer.credits_monthly_allocation) * 100
    : 0;
  const timeline = buildTimeline();
  const healthScore = getFinancialHealthScore();
  const aiSummary = generateAIStatusSummary();

  const EditableField = ({
    label,
    fieldName,
    value,
    type = 'text',
    options,
  }: {
    label: string;
    fieldName: keyof Customer;
    value: any;
    type?: 'text' | 'select' | 'number' | 'email' | 'url' | 'tel';
    options?: { value: string; label: string }[];
  }) => {
    const isEditing = editingField === fieldName;

    return (
      <div className="group">
        <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            {type === 'select' && options ? (
              <select
                value={fieldValues[fieldName] as string}
                onChange={(e) => setFieldValues(prev => ({ ...prev, [fieldName]: e.target.value }))}
                className="flex-1 px-2 py-1 text-sm border border-primary-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={fieldValues[fieldName] as string}
                onChange={(e) => setFieldValues(prev => ({ ...prev, [fieldName]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
                className="flex-1 px-2 py-1 text-sm border border-primary-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={submitting}
              />
            )}
            <button
              onClick={() => handleInlineFieldUpdate(fieldName, fieldValues[fieldName])}
              disabled={submitting}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setEditingField(null);
                setFieldValues(customer);
              }}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-900">
              {type === 'select' && options
                ? options.find(o => o.value === value)?.label || value
                : value || '-'}
            </p>
            {isAdminUser && (
              <button
                onClick={() => setEditingField(fieldName)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Success</p>
              <p className="text-green-700 text-sm mt-1">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/partner-portal/customers')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary-600" />
                {customer.company_name}
              </h1>
              <p className="text-gray-600 mt-1">
                {customer.industry} • {customer.country}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg border-2 ${getRiskColor(customer.overdelivery_risk_level || 'low')}`}>
              <p className="text-xs font-medium uppercase">Risk: {customer.overdelivery_risk_level || 'Low'}</p>
            </div>
          </div>
        </div>

        {aiSummary && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">AI Status Summary</p>
                <p className="text-sm text-blue-800 mt-1">{aiSummary}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${healthScore.color}`}>{healthScore.score}</p>
                <p className="text-xs text-gray-600 uppercase">{healthScore.status}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <PlanPricingCard
            planName={customer.credits_plan || 'starter'}
            pricePerCreditEUR={Number(customer.credits_price_per_credit) / (customer.currency_code === 'EUR' ? 1 : 11.5) || 150}
            monthlyCredits={Number(customer.credits_monthly_allocation) || 0}
            currency={customer.currency_code || 'EUR'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Coins className="h-6 w-6 text-primary-600" />
              </div>
              {isAdminUser && (
                <button
                  onClick={() => setShowCreditsModal(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Manage
                </button>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {creditsRemaining.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              of {customer.credits_monthly_allocation?.toFixed(0)} credits
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  creditsPercentage < 20 ? 'bg-red-500' :
                  creditsPercentage < 40 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {creditsPercentage.toFixed(0)}% remaining
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-emerald/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-accent-emerald" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(customer.monthly_recurring_revenue || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Monthly Recurring Revenue</p>
            <p className="text-xs text-gray-500 mt-2">
              {customer.credits_price_per_credit?.toFixed(0)} SEK per credit
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-cyan/10 rounded-lg">
                <Activity className="h-6 w-6 text-accent-cyan" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {thisMonthData.totalCredits.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Credits Used This Month</p>
            <p className="text-xs text-gray-500 mt-2">
              {thisMonthData.totalHours.toFixed(1)}h reported
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-amber/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent-amber" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {burnRate.daily.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Credits Per Day</p>
            <p className="text-xs text-gray-500 mt-2">
              {burnRate.projected.toFixed(0)} projected this month
            </p>
          </div>
        </div>

        {/* AI Decision Support Module */}
        <div className="mb-8">
          <CustomerHealthAI customerId={customerId!} onActionTaken={loadData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('burnRate')}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent-amber" />
                <h3 className="font-semibold text-gray-900">Burn Rate Forecast</h3>
              </div>
              {expandedSections.burnRate ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
            {expandedSections.burnRate && (
              <div className="px-6 pb-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Current consumption:</span>
                  <span className="font-bold text-blue-600">{burnRate.current.toFixed(1)} credits</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Daily burn rate:</span>
                  <span className="font-semibold">{burnRate.daily.toFixed(2)} credits/day</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Remaining period ({burnRate.daysRemaining}d):</span>
                  <span className="font-semibold">{burnRate.remaining.toFixed(1)} credits</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-purple-900">Projected month total:</span>
                  <span className={`font-bold text-lg ${
                    burnRate.projected > (customer.credits_monthly_allocation || 0)
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {burnRate.projected.toFixed(1)} credits
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Utilization forecast:</span>
                    <span className={`text-xl font-bold ${
                      (burnRate.projected / (customer.credits_monthly_allocation || 1)) > 1
                        ? 'text-red-600'
                        : (burnRate.projected / (customer.credits_monthly_allocation || 1)) > 0.9
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}>
                      {customer.credits_monthly_allocation
                        ? ((burnRate.projected / customer.credits_monthly_allocation) * 100).toFixed(0)
                        : 0}%
                    </span>
                  </div>
                  {burnRate.projected > (customer.credits_monthly_allocation || 0) && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-800">
                        Projected to exceed allocation by {((burnRate.projected / (customer.credits_monthly_allocation || 1) - 1) * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('margin')}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent-emerald" />
                <h3 className="font-semibold text-gray-900">Margin Analysis</h3>
              </div>
              {expandedSections.margin ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
            {expandedSections.margin && (
              <div className="px-6 pb-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">Revenue (actual):</span>
                  <span className="font-bold text-green-600">{formatCurrency(marginData.revenue)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Internal cost:</span>
                  <span className="font-semibold">{formatCurrency(marginData.cost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Gross margin:</span>
                  <span className={`font-bold ${
                    marginData.margin > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(marginData.margin)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Margin %:</span>
                    <span className={`text-3xl font-bold ${
                      marginData.marginPercentage > 40 ? 'text-green-600' :
                      marginData.marginPercentage > 20 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {marginData.marginPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        marginData.marginPercentage > 40 ? 'bg-green-500' :
                        marginData.marginPercentage > 20 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(marginData.marginPercentage, 100)}%` }}
                    />
                  </div>
                  {marginData.marginPercentage < 20 && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-800">Margin below target threshold (20%)</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-600" />
              Status Dimensions
            </h3>
            <div className="space-y-3">
              <EditableField
                label="Delivery Status"
                fieldName="delivery_status"
                value={customer.delivery_status}
                type="select"
                options={[
                  { value: 'on_track', label: 'On Track' },
                  { value: 'at_risk', label: 'At Risk' },
                  { value: 'delayed', label: 'Delayed' },
                ]}
              />
              <EditableField
                label="Commercial Status"
                fieldName="commercial_status"
                value={customer.commercial_status}
                type="select"
                options={[
                  { value: 'under_scope', label: 'Under Scope' },
                  { value: 'near_limit', label: 'Near Limit' },
                  { value: 'over_scope', label: 'Over Scope' },
                ]}
              />
              <EditableField
                label="Strategic Status"
                fieldName="strategic_status"
                value={customer.strategic_status}
                type="select"
                options={[
                  { value: 'initiering', label: 'Initiering' },
                  { value: 'aktiv', label: 'Aktiv' },
                  { value: 'skalning', label: 'Skalning' },
                  { value: 'optimering', label: 'Optimering' },
                  { value: 'pausad', label: 'Pausad' },
                ]}
              />
              <EditableField
                label="Collaboration"
                fieldName="collaboration_status"
                value={customer.collaboration_status}
                type="select"
                options={[
                  { value: 'fungerar_bra', label: 'Fungerar Bra' },
                  { value: 'kraver_beslut', label: 'Kräver Beslut' },
                  { value: 'blockerad', label: 'Blockerad' },
                ]}
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-primary-600" />
                  Active Projects ({projects.filter(p => p.status === 'active').length})
                </h3>
                {isAdminUser && (
                  <button
                    onClick={() => setShowAddProjectModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Project
                  </button>
                )}
              </div>

              <div className="p-6">
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderKanban className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No projects yet</p>
                    {isAdminUser && (
                      <button
                        onClick={() => setShowAddProjectModal(true)}
                        className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Create your first project
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 5).map(project => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => navigate(`/admin/partner-portal/projects/${project.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            {project.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{project.description}</p>
                            )}
                            {project.workstream && (
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {project.workstream}
                              </span>
                            )}
                          </div>
                          <div className="ml-4 flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status || 'active')}`}>
                              {project.status}
                            </span>
                            {project.priority && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                project.priority === 'high' ? 'bg-red-100 text-red-800' :
                                project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {project.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {projects.length > 5 && (
                      <button
                        onClick={() => navigate('/admin/partner-portal/projects')}
                        className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View all {projects.length} projects →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                onClick={() => toggleSection('timeline')}
              >
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent-cyan" />
                  Activity Timeline ({timeline.length})
                </h3>
                <div className="flex items-center gap-2">
                  {isAdminUser && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddNoteModal(true);
                      }}
                      className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Add Note
                    </button>
                  )}
                  {expandedSections.timeline ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </div>
              {expandedSections.timeline && (
                <div className="p-6">
                  {timeline.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No activity yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {timeline.slice(0, 15).map(event => (
                        <div key={event.id} className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${event.color.replace('text-', 'bg-')}/10`}>
                            <span className={event.color}>{event.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600 mt-0.5 break-words">{event.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDateTime(event.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                      {timeline.length > 15 && (
                        <p className="text-center text-sm text-gray-500 pt-4">
                          Showing 15 of {timeline.length} events
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                Company Information
              </h3>

              <div className="space-y-4">
                <EditableField label="Company Name" fieldName="company_name" value={customer.company_name} />
                <EditableField label="Org Number" fieldName="org_number" value={customer.org_number} />
                <EditableField label="Industry" fieldName="industry" value={customer.industry} />
                <EditableField label="Country" fieldName="country" value={customer.country} />
                <EditableField label="Website" fieldName="website" value={customer.website} type="url" />

                <div className="pt-4 border-t border-gray-200">
                  <EditableField label="Contact Name" fieldName="contact_name" value={customer.contact_name} />
                  <div className="mt-4">
                    <EditableField label="Contact Email" fieldName="contact_email" value={customer.contact_email} type="email" />
                  </div>
                  <div className="mt-4">
                    <EditableField label="Contact Phone" fieldName="contact_phone" value={customer.contact_phone} type="tel" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <EditableField
                    label="Plan Level"
                    fieldName="credits_plan_level"
                    value={customer.credits_plan_level}
                    type="select"
                    options={[
                      { value: 'starter', label: 'Starter' },
                      { value: 'growth', label: 'Growth' },
                      { value: 'scale', label: 'Scale' },
                      { value: 'custom', label: 'Custom' },
                    ]}
                  />
                </div>

                {customer.enterprise_tier && customer.enterprise_tier !== 'standard' && (
                  <EditableField
                    label="Enterprise Tier"
                    fieldName="enterprise_tier"
                    value={customer.enterprise_tier}
                    type="select"
                    options={[
                      { value: 'standard', label: 'Standard' },
                      { value: 'enterprise', label: 'Enterprise' },
                      { value: 'enterprise_plus', label: 'Enterprise Plus' },
                      { value: 'enterprise_custom', label: 'Enterprise Custom' },
                    ]}
                  />
                )}

                <div className="pt-4 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-500 uppercase">Created</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(customer.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {transactions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-accent-emerald" />
                  Recent Credit Transactions
                </h3>

                <div className="space-y-2">
                  {transactions.slice(0, 8).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className={`font-medium capitalize ${
                          tx.transaction_type === 'deduction' ? 'text-red-600' :
                          tx.transaction_type === 'allocation' ? 'text-green-600' :
                          'text-gray-900'
                        }`}>
                          {tx.transaction_type}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                      <span className={`font-bold ${
                        Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount).toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Manage Credits</h2>
              <button onClick={() => setShowCreditsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateCredits} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Credit Allocation
                </label>
                <input
                  type="number"
                  value={creditsForm.monthly_allocation}
                  onChange={(e) => setCreditsForm(prev => ({ ...prev, monthly_allocation: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance Adjustment
                </label>
                <input
                  type="number"
                  value={creditsForm.balance_adjustment}
                  onChange={(e) => setCreditsForm(prev => ({ ...prev, balance_adjustment: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  step="0.1"
                  placeholder="Enter + or - amount"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current balance: {customer.credits_balance?.toFixed(1)} credits
                  {creditsForm.balance_adjustment !== 0 && (
                    <span className="ml-2 font-medium">
                      → New: {((customer.credits_balance || 0) + creditsForm.balance_adjustment).toFixed(1)} credits
                    </span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Recurring Revenue (SEK)
                </label>
                <input
                  type="number"
                  value={creditsForm.monthly_recurring_revenue}
                  onChange={(e) => setCreditsForm(prev => ({ ...prev, monthly_recurring_revenue: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  step="1000"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Credit (SEK)
                </label>
                <input
                  type="number"
                  value={creditsForm.price_per_credit}
                  onChange={(e) => setCreditsForm(prev => ({ ...prev, price_per_credit: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  step="100"
                  min="0"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Credits'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreditsModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
              <button onClick={() => setShowAddProjectModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., E-commerce Platform Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief project description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workstream
                  </label>
                  <input
                    type="text"
                    value={newProject.workstream}
                    onChange={(e) => setNewProject(prev => ({ ...prev, workstream: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Digital, AI, SEO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Credits/Period
                  </label>
                  <input
                    type="number"
                    value={newProject.expected_credits_per_period || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, expected_credits_per_period: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    step="0.5"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target End Date
                  </label>
                  <input
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add Note</h2>
              <button onClick={() => setShowAddNoteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNote} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Type
                </label>
                <select
                  value={newNote.note_type}
                  onChange={(e) => setNewNote(prev => ({ ...prev, note_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="meeting">Meeting</option>
                  <option value="decision">Decision</option>
                  <option value="issue">Issue</option>
                  <option value="milestone">Milestone</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  required
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={5}
                  placeholder="Enter note content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility
                </label>
                <select
                  value={newNote.visibility}
                  onChange={(e) => setNewNote(prev => ({ ...prev, visibility: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="shared">Shared</option>
                  <option value="admin_only">Admin Only</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Note'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;

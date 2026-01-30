import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, User, Mail, Building2, Calendar, Clock,
  FileText, Tag, Link as LinkIcon, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
  ContactSubmission,
  BookingSubmission,
  NewsletterSubmission,
  LeadType,
  LeadStatus,
  LeadNote,
  LeadClassificationData,
  updateLeadStatus,
  getLeadNotes,
  createLeadNote,
  getLeadCustomerLink,
  createLeadCustomerLink,
  getAllCustomers,
  getLeadClassification,
  createLeadClassification,
  supabase
} from '../../lib/supabase';
import { isAdminAuthenticated, getCurrentAdminUser } from '../../lib/auth';
import { ADMIN_ROUTES } from '../../lib/admin-routes';
import { useLanguage } from '../../contexts/LanguageContext';

type Lead = ContactSubmission | BookingSubmission | NewsletterSubmission;

const LeadDetailPage = () => {
  const { type, id } = useParams<{ type: LeadType; id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [customerLink, setCustomerLink] = useState<any>(null);
  const [classification, setClassification] = useState<LeadClassificationData | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'internal' | 'follow_up' | 'qualification' | 'general'>('internal');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [linkNotes, setLinkNotes] = useState('');

  useEffect(() => {
    loadData();
  }, [type, id]);

  const loadData = async () => {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      navigate('/admin-login');
      return;
    }

    if (!type || !id) {
      navigate(ADMIN_ROUTES.LEADS);
      return;
    }

    try {
      setIsLoading(true);

      if (!supabase) {
        throw new Error('Supabase is not configured. Please check environment variables.');
      }

      const tableName = type === 'contact' ? 'contact_submissions' :
                        type === 'booking' ? 'booking_submissions' :
                        'newsletter_submissions';

      const { data: leadData, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setLead(leadData);

      const [notesData, linkData, classData, customersData] = await Promise.all([
        getLeadNotes(type, id),
        getLeadCustomerLink(type, id),
        getLeadClassification(type, id),
        getAllCustomers()
      ]);

      setNotes(notesData);
      setCustomerLink(linkData);
      setClassification(classData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading lead details:', error);
      showMessage('error', t('admin.lead_detail.error.load'));
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!type || !id) return;

    try {
      setIsSaving(true);
      await updateLeadStatus(type, id, newStatus);
      setLead(prev => prev ? { ...prev, status: newStatus } : null);
      showMessage('success', t('admin.lead_detail.success.status_updated'));
    } catch (error) {
      console.error('Error updating status:', error);
      showMessage('error', t('admin.lead_detail.error.status'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !type || !id) return;

    try {
      setIsSaving(true);
      const adminUser = await getCurrentAdminUser();
      if (!adminUser) throw new Error('Not authenticated');

      const note = await createLeadNote({
        lead_type: type,
        lead_id: id,
        note_type: noteType,
        content: newNote.trim(),
        created_by: adminUser.id
      });

      setNotes(prev => [note, ...prev]);
      setNewNote('');
      showMessage('success', t('admin.lead_detail.success.note_added'));
    } catch (error) {
      console.error('Error adding note:', error);
      showMessage('error', t('admin.lead_detail.error.note'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkToCustomer = async () => {
    if (!selectedCustomerId || !type || !id) return;

    try {
      setIsSaving(true);
      const adminUser = await getCurrentAdminUser();
      if (!adminUser) throw new Error('Not authenticated');

      const link = await createLeadCustomerLink({
        lead_type: type,
        lead_id: id,
        customer_id: selectedCustomerId,
        linked_by: adminUser.id,
        notes: linkNotes.trim() || undefined
      });

      await loadData();
      setSelectedCustomerId('');
      setLinkNotes('');
      showMessage('success', t('admin.lead_detail.success.linked'));
    } catch (error) {
      console.error('Error linking to customer:', error);
      showMessage('error', t('admin.lead_detail.error.link'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClassifyLead = async () => {
    if (!type || !id || !lead) return;

    try {
      setIsSaving(true);

      const classificationResult = await classifyLead(lead, type);

      const classification = await createLeadClassification({
        lead_type: type,
        lead_id: id,
        classification: classificationResult.classification,
        confidence_score: classificationResult.confidence,
        reasoning: classificationResult.reasoning,
        classification_data: classificationResult.data
      });

      setClassification(classification);
      showMessage('success', t('admin.lead_detail.success.classified'));
    } catch (error) {
      console.error('Error classifying lead:', error);
      showMessage('error', t('admin.lead_detail.error.classify'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.lead_detail.loading')}</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.lead_detail.not_found')}</h2>
          <p className="text-gray-600 mb-6">{t('admin.lead_detail.not_found_desc')}</p>
          <button
            onClick={() => navigate(ADMIN_ROUTES.LEADS)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('admin.lead_detail.back_to_leads')}
          </button>
        </div>
      </div>
    );
  }

  const getLeadTypeLabel = () => {
    return type === 'contact' ? t('admin.lead_detail.lead_type.contact') :
           type === 'booking' ? t('admin.lead_detail.lead_type.booking') :
           t('admin.lead_detail.lead_type.newsletter');
  };

  const getStatusColor = (status: LeadStatus) => {
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
      case 'high_potential': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium_potential': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low_potential': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'not_relevant': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(ADMIN_ROUTES.LEADS)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('admin.lead_detail.back_to_dashboard')}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{getLeadTypeLabel()}</h1>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                  {lead.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-600">
                {t('admin.lead_detail.submitted')} {new Date(lead.created_at).toLocaleDateString()} {t('admin.lead_detail.at')} {new Date(lead.created_at).toLocaleTimeString()}
              </p>
            </div>

            {saveMessage && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {saveMessage.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span>{saveMessage.text}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{t('admin.lead_detail.lead_info')}</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {type !== 'newsletter' && 'name' in lead && (
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                        <User className="h-4 w-4 mr-2" />
                        {t('admin.lead_detail.name')}
                      </dt>
                      <dd className="text-base text-gray-900">{lead.name}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {t('admin.lead_detail.email')}
                    </dt>
                    <dd className="text-base text-gray-900">
                      <a href={`mailto:${lead.email}`} className="text-primary-600 hover:text-primary-700">
                        {lead.email}
                      </a>
                    </dd>
                  </div>

                  {type !== 'newsletter' && 'company' in lead && lead.company && (
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                        <Building2 className="h-4 w-4 mr-2" />
                        {t('admin.lead_detail.company')}
                      </dt>
                      <dd className="text-base text-gray-900">{lead.company}</dd>
                    </div>
                  )}

                  {type === 'contact' && 'industry' in lead && (
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                        <Tag className="h-4 w-4 mr-2" />
                        {t('admin.lead_detail.industry')}
                      </dt>
                      <dd className="text-base text-gray-900">{lead.industry}</dd>
                    </div>
                  )}

                  {type === 'contact' && 'challenge' in lead && (
                    <div className="md:col-span-2">
                      <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                        <FileText className="h-4 w-4 mr-2" />
                        {t('admin.lead_detail.challenge')}
                      </dt>
                      <dd className="text-base text-gray-900">{lead.challenge}</dd>
                    </div>
                  )}

                  {type === 'contact' && 'message' in lead && lead.message && (
                    <div className="md:col-span-2">
                      <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                        <FileText className="h-4 w-4 mr-2" />
                        {t('admin.lead_detail.message')}
                      </dt>
                      <dd className="text-base text-gray-900 whitespace-pre-wrap">{lead.message}</dd>
                    </div>
                  )}

                  {type === 'booking' && 'meeting_type' in lead && (
                    <>
                      <div>
                        <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                          <Clock className="h-4 w-4 mr-2" />
                          {t('admin.lead_detail.meeting_type')}
                        </dt>
                        <dd className="text-base text-gray-900">{lead.meeting_type} {t('admin.lead_detail.minutes')}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          {t('admin.lead_detail.preferred_datetime')}
                        </dt>
                        <dd className="text-base text-gray-900">
                          {new Date(lead.preferred_date).toLocaleDateString()} {t('admin.lead_detail.at')} {lead.preferred_time}
                        </dd>
                      </div>
                      {lead.message && (
                        <div className="md:col-span-2">
                          <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                            <FileText className="h-4 w-4 mr-2" />
                            {t('admin.lead_detail.message')}
                          </dt>
                          <dd className="text-base text-gray-900 whitespace-pre-wrap">{lead.message}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{t('admin.lead_detail.notes')}</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.lead_detail.add_note')}
                  </label>
                  <div className="flex gap-3 mb-3">
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="internal">{t('admin.lead_detail.note_type.internal')}</option>
                      <option value="follow_up">{t('admin.lead_detail.note_type.follow_up')}</option>
                      <option value="qualification">{t('admin.lead_detail.note_type.qualification')}</option>
                      <option value="general">{t('admin.lead_detail.note_type.general')}</option>
                    </select>
                  </div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={t('admin.lead_detail.add_internal_note')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSaving}
                    className="mt-3 flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t('admin.lead_detail.add_note')}
                  </button>
                </div>

                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">{t('admin.lead_detail.no_notes')}</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                            note.note_type === 'follow_up' ? 'bg-yellow-100 text-yellow-800' :
                            note.note_type === 'qualification' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {note.note_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(note.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('admin.lead_detail.status')}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {(['new', 'in_progress', 'qualified', 'archived'] as LeadStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={isSaving || lead.status === status}
                      className={`w-full px-4 py-2 rounded-lg text-left font-medium transition-colors ${
                        lead.status === status
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {t(`admin.lead_detail.status.${status}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {classification && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{t('admin.lead_detail.ai_classification')}</h2>
                </div>
                <div className="p-6">
                  <div className={`border-2 rounded-lg p-4 ${getClassificationColor(classification.classification)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-semibold">
                        {classification.classification.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm mb-2">
                      {t('admin.lead_detail.confidence')}: {Math.round(classification.confidence_score * 100)}%
                    </div>
                    <p className="text-sm">{classification.reasoning}</p>
                  </div>
                </div>
              </div>
            )}

            {!classification && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{t('admin.lead_detail.ai_classification')}</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    {t('admin.lead_detail.classify_desc')}
                  </p>
                  <button
                    onClick={handleClassifyLead}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('admin.lead_detail.classify_lead')}
                  </button>
                </div>
              </div>
            )}

            {customerLink ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{t('admin.lead_detail.linked_customer')}</h2>
                </div>
                <div className="p-6">
                  <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-green-800">
                      <LinkIcon className="h-5 w-5" />
                      <span className="font-semibold">{t('admin.lead_detail.connected')}</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {customerLink.customers?.company_name || t('admin.lead_detail.unknown_customer')}
                    </p>
                    {customerLink.notes && (
                      <p className="text-sm text-gray-600 mt-2">{customerLink.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{t('admin.lead_detail.link_to_customer')}</h2>
                </div>
                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.lead_detail.select_customer')}
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 mb-3"
                  >
                    <option value="">{t('admin.lead_detail.select_customer_placeholder')}</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company_name}
                      </option>
                    ))}
                  </select>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.lead_detail.notes_optional')}
                  </label>
                  <textarea
                    value={linkNotes}
                    onChange={(e) => setLinkNotes(e.target.value)}
                    placeholder={t('admin.lead_detail.add_notes_conversion')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 mb-3"
                  />

                  <button
                    onClick={handleLinkToCustomer}
                    disabled={!selectedCustomerId || isSaving}
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {t('admin.lead_detail.link_to_customer')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

async function classifyLead(lead: Lead, type: LeadType): Promise<{
  classification: 'high_potential' | 'medium_potential' | 'low_potential' | 'not_relevant';
  confidence: number;
  reasoning: string;
  data: Record<string, unknown>;
}> {
  let score = 0;
  let reasons: string[] = [];

  if (type === 'contact' && 'company' in lead) {
    if (lead.company) {
      score += 25;
      reasons.push('Has company name');
    }

    if (lead.industry) {
      score += 15;
      reasons.push('Industry specified');
    }

    if (lead.message && lead.message.length > 100) {
      score += 20;
      reasons.push('Detailed message provided');
    }

    const highValueChallenges = ['scaling', 'growth', 'ai', 'automation', 'digital transformation'];
    if (highValueChallenges.some(keyword => lead.challenge?.toLowerCase().includes(keyword))) {
      score += 25;
      reasons.push('High-value challenge identified');
    }
  } else if (type === 'booking') {
    score += 30;
    reasons.push('Proactive meeting request');

    if ('company' in lead && lead.company) {
      score += 20;
      reasons.push('Company provided');
    }

    if ('meeting_type' in lead && lead.meeting_type === '60') {
      score += 15;
      reasons.push('Requested extended meeting');
    }
  } else if (type === 'newsletter') {
    score += 10;
    reasons.push('Interest in staying informed');
  }

  let classification: 'high_potential' | 'medium_potential' | 'low_potential' | 'not_relevant';
  if (score >= 70) classification = 'high_potential';
  else if (score >= 40) classification = 'medium_potential';
  else if (score >= 20) classification = 'low_potential';
  else classification = 'not_relevant';

  const confidence = Math.min(score / 100, 0.95);
  const reasoning = reasons.length > 0
    ? `${reasons.join('. ')}.`
    : 'Based on basic lead information.';

  return {
    classification,
    confidence,
    reasoning,
    data: { score, reasons }
  };
}

export default LeadDetailPage;

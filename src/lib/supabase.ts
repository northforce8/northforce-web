import { createClient } from '@supabase/supabase-js'; // Supabase client library

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('SUPABASE CONFIG ERROR:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    message: 'Missing required environment variables. Admin login will not work.'
  });
}

export const getMissingEnvVars = (): string[] => {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  return missing;
};

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export type LeadStatus = 'new' | 'in_progress' | 'qualified' | 'archived';
export type LeadType = 'contact' | 'booking' | 'newsletter';
export type LeadClassification = 'high_potential' | 'medium_potential' | 'low_potential' | 'not_relevant';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  challenge: string;
  timeline?: string;
  budget?: string;
  message?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface BookingSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  meeting_type: string;
  preferred_date: string;
  preferred_time: string;
  timezone: string;
  message?: string;
  calendar_event_id?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubmission {
  id: string;
  email: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_type: LeadType;
  lead_id: string;
  note_type: 'internal' | 'follow_up' | 'qualification' | 'general';
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LeadCustomerLink {
  id: string;
  lead_type: LeadType;
  lead_id: string;
  customer_id: string;
  linked_by: string;
  linked_at: string;
  notes?: string;
}

export interface LeadClassificationData {
  id: string;
  lead_type: LeadType;
  lead_id: string;
  classification: LeadClassification;
  confidence_score: number;
  reasoning: string;
  classification_data?: Record<string, unknown>;
  classified_at: string;
}

export interface Customer {
  id: string;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  status: string;
  created_at: string;
}

// Database operations
export const saveContactSubmission = async (data: Omit<ContactSubmission, 'id' | 'created_at'>) => {
  if (!supabase) {
    return { id: 'mock-id', ...data, created_at: new Date().toISOString() };
  }
  
  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const saveBookingSubmission = async (data: Omit<BookingSubmission, 'id' | 'created_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured. Booking submission not saved.');
    return { id: 'mock-id', ...data, created_at: new Date().toISOString() };
  }
  
  const { data: result, error } = await supabase
    .from('booking_submissions')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const saveNewsletterSubmission = async (data: Omit<NewsletterSubmission, 'id' | 'created_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured. Newsletter submission not saved.');
    return { id: 'mock-id', ...data, created_at: new Date().toISOString() };
  }
  
  const { data: result, error } = await supabase
    .from('newsletter_submissions')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getAllSubmissions = async () => {
  if (!supabase) {
    console.warn('Supabase not configured. Returning empty submissions.');
    return { contact: [], booking: [], newsletter: [] };
  }
  
  const [contactResult, bookingResult, newsletterResult] = await Promise.all([
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
    supabase.from('booking_submissions').select('*').order('created_at', { ascending: false }),
    supabase.from('newsletter_submissions').select('*').order('created_at', { ascending: false })
  ]);

  if (contactResult.error) throw contactResult.error;
  if (bookingResult.error) throw bookingResult.error;
  if (newsletterResult.error) throw newsletterResult.error;

  return {
    contact: contactResult.data || [],
    booking: bookingResult.data || [],
    newsletter: newsletterResult.data || []
  };
};

export const searchSubmissions = async (query: string) => {
  if (!supabase) {
    console.warn('Supabase not configured. Returning empty search results.');
    return { contact: [], booking: [], newsletter: [] };
  }

  const searchTerm = `%${query.toLowerCase()}%`;

  const [contactResult, bookingResult, newsletterResult] = await Promise.all([
    supabase
      .from('contact_submissions')
      .select('*')
      .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},company.ilike.${searchTerm}`)
      .order('created_at', { ascending: false }),
    supabase
      .from('booking_submissions')
      .select('*')
      .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},company.ilike.${searchTerm}`)
      .order('created_at', { ascending: false }),
    supabase
      .from('newsletter_submissions')
      .select('*')
      .ilike('email', searchTerm)
      .order('created_at', { ascending: false })
  ]);

  if (contactResult.error) throw contactResult.error;
  if (bookingResult.error) throw bookingResult.error;
  if (newsletterResult.error) throw newsletterResult.error;

  return {
    contact: contactResult.data || [],
    booking: bookingResult.data || [],
    newsletter: newsletterResult.data || []
  };
};

export const updateLeadStatus = async (leadType: LeadType, leadId: string, status: LeadStatus) => {
  if (!supabase) throw new Error('Supabase not configured');

  const tableName = leadType === 'contact' ? 'contact_submissions' :
                    leadType === 'booking' ? 'booking_submissions' :
                    'newsletter_submissions';

  const { data, error } = await supabase
    .from(tableName)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getLeadNotes = async (leadType: LeadType, leadId: string) => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_type', leadType)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createLeadNote = async (note: Omit<LeadNote, 'id' | 'created_at' | 'updated_at'>) => {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('lead_notes')
    .insert([note])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getLeadCustomerLink = async (leadType: LeadType, leadId: string) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('lead_customer_links')
    .select('*, customers(id, company_name, contact_name, contact_email)')
    .eq('lead_type', leadType)
    .eq('lead_id', leadId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createLeadCustomerLink = async (link: Omit<LeadCustomerLink, 'id' | 'linked_at'>) => {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('lead_customer_links')
    .insert([link])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllCustomers = async () => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('customers')
    .select('id, company_name, contact_name, contact_email, status')
    .eq('status', 'active')
    .order('company_name');

  if (error) throw error;
  return data || [];
};

export const getLeadClassification = async (leadType: LeadType, leadId: string) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('lead_classifications')
    .select('*')
    .eq('lead_type', leadType)
    .eq('lead_id', leadId)
    .order('classified_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createLeadClassification = async (classification: Omit<LeadClassificationData, 'id' | 'classified_at'>) => {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('lead_classifications')
    .insert([classification])
    .select()
    .single();

  if (error) throw error;
  return data;
};
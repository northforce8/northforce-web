// Database configuration for submissions
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
  submittedAt: Date;
  type: 'contact';
}

export interface BookingSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  meetingType: '30' | '45' | '60';
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  message?: string;
  submittedAt: Date;
  calendarEventId?: string;
  type: 'booking';
}

export interface NewsletterSubmission {
  id: string;
  email: string;
  submittedAt: Date;
  type: 'newsletter';
}

export type Submission = ContactSubmission | BookingSubmission | NewsletterSubmission;

// In-memory storage for demo purposes
// In production, this would be replaced with a proper database
const submissions: Submission[] = [];

export const saveSubmission = (submission: Submission): void => {
  submissions.push(submission);
};

export const getSubmissions = (): Submission[] => {
  return submissions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
};

export const getSubmissionById = (id: string): Submission | undefined => {
  return submissions.find(sub => sub.id === id);
};

export const searchSubmissions = (query: string): Submission[] => {
  const lowercaseQuery = query.toLowerCase();
  return submissions.filter(sub => {
    if (sub.type === 'contact') {
      return sub.name.toLowerCase().includes(lowercaseQuery) ||
             sub.email.toLowerCase().includes(lowercaseQuery) ||
             sub.company.toLowerCase().includes(lowercaseQuery);
    } else if (sub.type === 'booking') {
      return sub.name.toLowerCase().includes(lowercaseQuery) ||
             sub.email.toLowerCase().includes(lowercaseQuery) ||
             (sub.company && sub.company.toLowerCase().includes(lowercaseQuery));
    } else {
      return sub.email.toLowerCase().includes(lowercaseQuery);
    }
  });
};

export const exportSubmissionsToCSV = (): string => {
  const headers = ['Type', 'Name', 'Email', 'Company', 'Submitted At', 'Details'];
  const rows = submissions.map(sub => {
    const baseData = [
      sub.type,
      sub.type === 'newsletter' ? '' : (sub as ContactSubmission | BookingSubmission).name,
      sub.email,
      sub.type === 'contact' ? (sub as ContactSubmission).company : 
      sub.type === 'booking' ? ((sub as BookingSubmission).company || '') : '',
      sub.submittedAt.toISOString(),
      sub.type === 'contact' ? (sub as ContactSubmission).challenge :
      sub.type === 'booking' ? `${(sub as BookingSubmission).meetingType} min meeting` : 'Newsletter signup'
    ];
    return baseData.map(field => `"${field}"`).join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
};
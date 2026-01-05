export type ErrorType = 'Auth' | 'RLS' | 'Network' | 'Mapping' | 'Unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  requiresAuth: boolean;
}

export function categorizeError(error: unknown): ErrorInfo {
  const errorMsg = error instanceof Error ? error.message : String(error);

  if (errorMsg.includes('RLS') || errorMsg.includes('permission') || errorMsg.includes('policy') || errorMsg.includes('row-level security')) {
    return {
      type: 'RLS',
      message: 'Access denied. Your account may not have proper permissions.',
      requiresAuth: true
    };
  }

  if (errorMsg.includes('JWT') || errorMsg.includes('auth') || errorMsg.includes('session') || errorMsg.includes('unauthorized')) {
    return {
      type: 'Auth',
      message: 'Session expired. Please log in again.',
      requiresAuth: true
    };
  }

  if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('timeout')) {
    return {
      type: 'Network',
      message: 'Network error. Please check your connection and try again.',
      requiresAuth: false
    };
  }

  if (errorMsg.includes('undefined') || errorMsg.includes('null') || errorMsg.includes('cannot read')) {
    return {
      type: 'Mapping',
      message: 'Data structure error. Please contact support.',
      requiresAuth: false
    };
  }

  return {
    type: 'Unknown',
    message: 'An unexpected error occurred. Please try again.',
    requiresAuth: false
  };
}

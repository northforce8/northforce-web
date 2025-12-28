/**
 * Enterprise-grade error logging for admin portal
 * Tracks errors with unique IDs for incident tracking
 */

interface ErrorContext {
  route: string;
  userId?: string;
  action?: string;
  componentStack?: string;
  additionalData?: Record<string, unknown>;
}

interface LoggedError {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  context: ErrorContext;
}

const errorLog: LoggedError[] = [];
const MAX_LOG_SIZE = 100;

function generateErrorId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ERR-${timestamp}-${random}`.toUpperCase();
}

export function logAdminError(
  error: Error | string,
  context: Partial<ErrorContext> = {}
): string {
  const errorId = generateErrorId();
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  const loggedError: LoggedError = {
    id: errorId,
    timestamp: Date.now(),
    message: errorMessage,
    stack: errorStack,
    context: {
      route: window.location.pathname,
      ...context,
    },
  };

  errorLog.unshift(loggedError);
  if (errorLog.length > MAX_LOG_SIZE) {
    errorLog.pop();
  }

  console.error(`[${errorId}] Admin Error:`, {
    message: errorMessage,
    route: loggedError.context.route,
    userId: loggedError.context.userId,
    action: loggedError.context.action,
    stack: errorStack?.split('\n').slice(0, 3).join('\n'),
  });

  return errorId;
}

export function getErrorLog(): LoggedError[] {
  return [...errorLog];
}

export function getErrorById(id: string): LoggedError | undefined {
  return errorLog.find(e => e.id === id);
}

export function clearErrorLog(): void {
  errorLog.length = 0;
}

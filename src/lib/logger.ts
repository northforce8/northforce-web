type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  customerId?: string;
  requestId?: string;
}

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  maxBufferSize: number;
}

class Logger {
  private config: LoggerConfig = {
    level: 'info',
    enableConsole: true,
    enableRemote: false,
    maxBufferSize: 100,
  };

  private buffer: LogEntry[] = [];
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  };

  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.config.level];
  }

  private formatLog(entry: LogEntry): string {
    const parts = [
      entry.timestamp,
      `[${entry.level.toUpperCase()}]`,
      entry.message,
    ];

    if (entry.context) {
      parts.push(JSON.stringify(entry.context));
    }

    if (entry.error) {
      parts.push(`Error: ${entry.error.message}`);
      if (entry.error.stack) {
        parts.push(entry.error.stack);
      }
    }

    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, meta?: {
    context?: Record<string, any>;
    error?: Error;
    userId?: string;
    customerId?: string;
    requestId?: string;
  }): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };

    this.buffer.push(entry);

    if (this.buffer.length > this.config.maxBufferSize) {
      this.buffer.shift();
    }

    if (this.config.enableConsole) {
      const formatted = this.formatLog(entry);

      switch (level) {
        case 'debug':
          console.debug(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
        case 'fatal':
          console.error(formatted);
          break;
      }
    }

    if (this.config.enableRemote && level !== 'debug') {
      this.sendToRemote(entry).catch(err => {
        console.error('Failed to send log to remote:', err);
      });
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    return Promise.resolve();
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, { context });
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, { context });
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, { context });
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, { error, context });
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('fatal', message, { error, context });
  }

  withContext(baseContext: Record<string, any>) {
    return {
      debug: (msg: string, ctx?: Record<string, any>) =>
        this.debug(msg, { ...baseContext, ...ctx }),
      info: (msg: string, ctx?: Record<string, any>) =>
        this.info(msg, { ...baseContext, ...ctx }),
      warn: (msg: string, ctx?: Record<string, any>) =>
        this.warn(msg, { ...baseContext, ...ctx }),
      error: (msg: string, error?: Error, ctx?: Record<string, any>) =>
        this.error(msg, error, { ...baseContext, ...ctx }),
      fatal: (msg: string, error?: Error, ctx?: Record<string, any>) =>
        this.fatal(msg, error, { ...baseContext, ...ctx }),
    };
  }

  getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  clearBuffer(): void {
    this.buffer = [];
  }

  getStats(): {
    bufferSize: number;
    levelCounts: Record<LogLevel, number>;
  } {
    const levelCounts: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      fatal: 0,
    };

    for (const entry of this.buffer) {
      levelCounts[entry.level]++;
    }

    return {
      bufferSize: this.buffer.length,
      levelCounts,
    };
  }
}

export const logger = new Logger();

if (import.meta.env.PROD) {
  logger.configure({ level: 'info', enableRemote: true });
} else {
  logger.configure({ level: 'debug', enableRemote: false });
}

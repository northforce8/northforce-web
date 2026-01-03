interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private configs = new Map<string, RateLimitConfig>();

  constructor() {
    this.registerDefaults();
    setInterval(() => this.cleanup(), 60000);
  }

  private registerDefaults(): void {
    this.configs.set('default', {
      windowMs: 60000,
      maxRequests: 100,
    });

    this.configs.set('api:query', {
      windowMs: 60000,
      maxRequests: 500,
    });

    this.configs.set('api:mutation', {
      windowMs: 60000,
      maxRequests: 100,
    });

    this.configs.set('api:ai', {
      windowMs: 60000,
      maxRequests: 20,
    });

    this.configs.set('api:export', {
      windowMs: 300000,
      maxRequests: 10,
    });

    this.configs.set('auth:login', {
      windowMs: 300000,
      maxRequests: 5,
    });

    this.configs.set('auth:password-reset', {
      windowMs: 3600000,
      maxRequests: 3,
    });
  }

  registerLimit(key: string, config: RateLimitConfig): void {
    this.configs.set(key, config);
  }

  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        toDelete.push(key);
      }
    }

    toDelete.forEach(key => this.limits.delete(key));
  }

  check(identifier: string, category: string = 'default'): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  } {
    const config = this.configs.get(category) || this.configs.get('default')!;
    const key = `${category}:${identifier}`;
    const now = Date.now();

    let entry = this.limits.get(key);

    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      };
      this.limits.set(key, entry);
    }

    const allowed = entry.count < config.maxRequests;

    if (allowed) {
      entry.count++;
    }

    return {
      allowed,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      retryAfter: allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  reset(identifier: string, category?: string): void {
    if (category) {
      const key = `${category}:${identifier}`;
      this.limits.delete(key);
    } else {
      const pattern = new RegExp(`:${identifier}$`);
      for (const key of this.limits.keys()) {
        if (pattern.test(key)) {
          this.limits.delete(key);
        }
      }
    }
  }

  getStats(): {
    totalLimits: number;
    activeUsers: number;
    categories: string[];
  } {
    const categories = Array.from(this.configs.keys());
    const uniqueIdentifiers = new Set<string>();

    for (const key of this.limits.keys()) {
      const identifier = key.split(':').slice(1).join(':');
      uniqueIdentifiers.add(identifier);
    }

    return {
      totalLimits: this.limits.size,
      activeUsers: uniqueIdentifiers.size,
      categories,
    };
  }
}

export const rateLimiter = new RateLimiter();

export function checkRateLimit(
  identifier: string,
  category?: string
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  return rateLimiter.check(identifier, category);
}

export function resetRateLimit(identifier: string, category?: string): void {
  rateLimiter.reset(identifier, category);
}

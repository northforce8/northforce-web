import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter } from '../../lib/rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    rateLimiter.reset('test-user');
  });

  it('should allow requests within limit', () => {
    rateLimiter.registerLimit('test', { windowMs: 60000, maxRequests: 5 });

    const result1 = rateLimiter.check('test-user', 'test');
    const result2 = rateLimiter.check('test-user', 'test');
    const result3 = rateLimiter.check('test-user', 'test');

    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(2);
  });

  it('should block requests exceeding limit', () => {
    rateLimiter.registerLimit('test', { windowMs: 60000, maxRequests: 3 });

    rateLimiter.check('test-user', 'test');
    rateLimiter.check('test-user', 'test');
    rateLimiter.check('test-user', 'test');
    const result = rateLimiter.check('test-user', 'test');

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('should reset limits after window expires', async () => {
    rateLimiter.registerLimit('test', { windowMs: 50, maxRequests: 2 });

    rateLimiter.check('test-user', 'test');
    rateLimiter.check('test-user', 'test');
    const blocked = rateLimiter.check('test-user', 'test');

    expect(blocked.allowed).toBe(false);

    await new Promise(resolve => setTimeout(resolve, 60));

    const allowed = rateLimiter.check('test-user', 'test');
    expect(allowed.allowed).toBe(true);
  });

  it('should track different categories independently', () => {
    rateLimiter.registerLimit('api', { windowMs: 60000, maxRequests: 10 });
    rateLimiter.registerLimit('auth', { windowMs: 60000, maxRequests: 3 });

    for (let i = 0; i < 5; i++) {
      rateLimiter.check('test-user', 'api');
    }

    for (let i = 0; i < 3; i++) {
      rateLimiter.check('test-user', 'auth');
    }

    const apiResult = rateLimiter.check('test-user', 'api');
    const authResult = rateLimiter.check('test-user', 'auth');

    expect(apiResult.allowed).toBe(true);
    expect(authResult.allowed).toBe(false);
  });

  it('should provide accurate stats', () => {
    rateLimiter.registerLimit('test', { windowMs: 60000, maxRequests: 5 });

    rateLimiter.check('user1', 'test');
    rateLimiter.check('user2', 'test');
    rateLimiter.check('user1', 'test');

    const stats = rateLimiter.getStats();

    expect(stats.totalLimits).toBeGreaterThan(0);
    expect(stats.activeUsers).toBe(2);
    expect(stats.categories.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { apiCache } from '../../lib/api-cache';

describe('API Cache', () => {
  beforeEach(() => {
    apiCache.clear();
  });

  it('should cache and retrieve data', async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      return { data: 'test' };
    };

    const result1 = await apiCache.get('test-key', fetchFn);
    const result2 = await apiCache.get('test-key', fetchFn);

    expect(result1).toEqual({ data: 'test' });
    expect(result2).toEqual({ data: 'test' });
    expect(callCount).toBe(1);
  });

  it('should respect cache duration', async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      return { data: 'test' };
    };

    await apiCache.get('test-key', fetchFn, 10);

    await new Promise(resolve => setTimeout(resolve, 15));

    await apiCache.get('test-key', fetchFn, 10);

    expect(callCount).toBe(2);
  });

  it('should invalidate specific keys', async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      return { data: 'test' };
    };

    await apiCache.get('test-key', fetchFn);
    apiCache.invalidate('test-key');
    await apiCache.get('test-key', fetchFn);

    expect(callCount).toBe(2);
  });

  it('should invalidate by pattern', async () => {
    const fetchFn = async (val: string) => ({ data: val });

    await apiCache.get('user:1', () => fetchFn('1'));
    await apiCache.get('user:2', () => fetchFn('2'));
    await apiCache.get('product:1', () => fetchFn('p1'));

    apiCache.invalidatePattern('user:.*');

    expect(apiCache.size()).toBe(1);
  });

  it('should track cache statistics', async () => {
    const fetchFn = async () => ({ data: 'test' });

    await apiCache.get('key1', fetchFn);
    await apiCache.get('key1', fetchFn);
    await apiCache.get('key2', fetchFn);

    const stats = apiCache.getStats();

    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(2);
    expect(stats.size).toBe(2);
  });

  it('should calculate hit rate correctly', async () => {
    const fetchFn = async () => ({ data: 'test' });

    await apiCache.get('key1', fetchFn);
    await apiCache.get('key1', fetchFn);
    await apiCache.get('key1', fetchFn);

    const hitRate = apiCache.getHitRate();

    expect(hitRate).toBeCloseTo(0.666, 2);
  });

  it('should support cache warmup', async () => {
    let callCount = 0;
    const fetchFn = async (id: string) => {
      callCount++;
      return { id, data: `test-${id}` };
    };

    await apiCache.warmup([
      { key: 'key1', fetchFn: () => fetchFn('1') },
      { key: 'key2', fetchFn: () => fetchFn('2') },
      { key: 'key3', fetchFn: () => fetchFn('3') },
    ]);

    expect(callCount).toBe(3);
    expect(apiCache.size()).toBe(3);

    await apiCache.get('key1', () => fetchFn('1'));
    expect(callCount).toBe(3);
  });

  it('should evict LRU entries when size limit reached', async () => {
    apiCache.configure({ maxSize: 3 });

    const fetchFn = async (val: string) => ({ data: val });

    await apiCache.get('key1', () => fetchFn('1'));
    await apiCache.get('key2', () => fetchFn('2'));
    await apiCache.get('key3', () => fetchFn('3'));

    await apiCache.get('key2', () => fetchFn('2'));
    await apiCache.get('key4', () => fetchFn('4'));

    expect(apiCache.size()).toBe(3);

    const stats = apiCache.getStats();
    expect(stats.evictions).toBeGreaterThan(0);
  });
});

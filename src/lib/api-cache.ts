interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultDuration = 5 * 60 * 1000;

  async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    duration: number = this.defaultDuration
  ): Promise<T> {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      return cached.data;
    }

    const data = await fetchFn();

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const apiCache = new APICache();

export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  duration?: number
): Promise<T> {
  return apiCache.get(key, queryFn, duration);
}

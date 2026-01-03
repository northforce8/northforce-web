interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  memoryUsage: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultDuration = 5 * 60 * 1000;
  private maxSize = 1000;
  private maxMemory = 50 * 1024 * 1024;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    memoryUsage: 0,
  };

  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 1024;
    }
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey);
      if (entry) {
        this.stats.memoryUsage -= entry.size;
      }
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key);
        this.stats.memoryUsage -= entry.size;
      }
    }

    toDelete.forEach(key => this.cache.delete(key));
  }

  async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    duration: number = this.defaultDuration
  ): Promise<T> {
    this.cleanup();

    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      this.stats.hits++;
      return cached.data;
    }

    this.stats.misses++;
    const data = await fetchFn();
    const size = this.estimateSize(data);

    while (
      (this.cache.size >= this.maxSize ||
       this.stats.memoryUsage + size > this.maxMemory) &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      size,
      ttl: duration,
    });

    this.stats.memoryUsage += size;
    this.stats.size = this.cache.size;

    return data;
  }

  invalidate(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.memoryUsage -= entry.size;
    }
    this.cache.delete(key);
    this.stats.size = this.cache.size;
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.invalidate(key);
      }
    }
  }

  invalidateByTags(tags: string[]): void {
    for (const tag of tags) {
      this.invalidatePattern(`.*${tag}.*`);
    }
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      memoryUsage: 0,
    };
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  warmup<T>(keys: Array<{ key: string; fetchFn: () => Promise<T>; duration?: number }>): Promise<void[]> {
    return Promise.all(
      keys.map(({ key, fetchFn, duration }) =>
        this.get(key, fetchFn, duration).catch(() => {})
      )
    );
  }

  configure(options: {
    maxSize?: number;
    maxMemory?: number;
    defaultDuration?: number;
  }): void {
    if (options.maxSize !== undefined) this.maxSize = options.maxSize;
    if (options.maxMemory !== undefined) this.maxMemory = options.maxMemory;
    if (options.defaultDuration !== undefined) this.defaultDuration = options.defaultDuration;
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

type EventHandler<T = any> = (data: T) => void | Promise<void>;

interface EventSubscription {
  id: string;
  handler: EventHandler;
  once: boolean;
}

export type SystemEvent =
  | 'customer:created'
  | 'customer:updated'
  | 'customer:deleted'
  | 'project:created'
  | 'project:updated'
  | 'project:completed'
  | 'okr:created'
  | 'okr:updated'
  | 'okr:progress-updated'
  | 'swot:created'
  | 'swot:updated'
  | 'bsc:created'
  | 'bsc:updated'
  | 'bmc:created'
  | 'bmc:updated'
  | 'invoice:created'
  | 'invoice:sent'
  | 'invoice:paid'
  | 'time-entry:created'
  | 'time-entry:updated'
  | 'contract:created'
  | 'contract:signed'
  | 'contract:expired'
  | 'growth-plan:created'
  | 'growth-plan:updated'
  | 'recommendation:generated'
  | 'cache:invalidate'
  | 'user:login'
  | 'user:logout'
  | 'error:critical';

interface EventData {
  'customer:created': { id: string; name: string };
  'customer:updated': { id: string; changes: Record<string, any> };
  'customer:deleted': { id: string };
  'project:created': { id: string; customerId: string };
  'project:updated': { id: string; customerId: string };
  'project:completed': { id: string; customerId: string };
  'okr:created': { id: string; customerId: string };
  'okr:updated': { id: string; customerId: string };
  'okr:progress-updated': { id: string; customerId: string; progress: number };
  'swot:created': { id: string; customerId: string };
  'swot:updated': { id: string; customerId: string };
  'bsc:created': { id: string; customerId: string };
  'bsc:updated': { id: string; customerId: string };
  'bmc:created': { id: string; customerId: string };
  'bmc:updated': { id: string; customerId: string };
  'invoice:created': { id: string; customerId: string };
  'invoice:sent': { id: string; customerId: string };
  'invoice:paid': { id: string; customerId: string };
  'time-entry:created': { id: string; customerId: string };
  'time-entry:updated': { id: string; customerId: string };
  'contract:created': { id: string; customerId: string };
  'contract:signed': { id: string; customerId: string };
  'contract:expired': { id: string; customerId: string };
  'growth-plan:created': { id: string; customerId: string };
  'growth-plan:updated': { id: string; customerId: string };
  'recommendation:generated': { type: string; customerId: string; recommendations: any[] };
  'cache:invalidate': { keys: string[]; tags?: string[] };
  'user:login': { userId: string };
  'user:logout': { userId: string };
  'error:critical': { error: Error; context: Record<string, any> };
}

class EventBus {
  private subscriptions = new Map<string, EventSubscription[]>();
  private eventHistory: Array<{ event: string; timestamp: number }> = [];
  private maxHistorySize = 100;

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  on<E extends SystemEvent>(
    event: E,
    handler: (data: EventData[E]) => void | Promise<void>
  ): () => void {
    const subscription: EventSubscription = {
      id: this.generateId(),
      handler: handler as EventHandler,
      once: false,
    };

    const subs = this.subscriptions.get(event) || [];
    subs.push(subscription);
    this.subscriptions.set(event, subs);

    return () => this.off(event, subscription.id);
  }

  once<E extends SystemEvent>(
    event: E,
    handler: (data: EventData[E]) => void | Promise<void>
  ): () => void {
    const subscription: EventSubscription = {
      id: this.generateId(),
      handler: handler as EventHandler,
      once: true,
    };

    const subs = this.subscriptions.get(event) || [];
    subs.push(subscription);
    this.subscriptions.set(event, subs);

    return () => this.off(event, subscription.id);
  }

  off(event: SystemEvent, subscriptionId: string): void {
    const subs = this.subscriptions.get(event);
    if (!subs) return;

    const filtered = subs.filter(s => s.id !== subscriptionId);
    if (filtered.length === 0) {
      this.subscriptions.delete(event);
    } else {
      this.subscriptions.set(event, filtered);
    }
  }

  async emit<E extends SystemEvent>(
    event: E,
    data: EventData[E]
  ): Promise<void> {
    this.eventHistory.push({ event, timestamp: Date.now() });
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    const subs = this.subscriptions.get(event);
    if (!subs || subs.length === 0) return;

    const toRemove: string[] = [];

    for (const sub of subs) {
      try {
        await sub.handler(data);
        if (sub.once) {
          toRemove.push(sub.id);
        }
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    }

    if (toRemove.length > 0) {
      const remaining = subs.filter(s => !toRemove.includes(s.id));
      if (remaining.length === 0) {
        this.subscriptions.delete(event);
      } else {
        this.subscriptions.set(event, remaining);
      }
    }
  }

  clear(event?: SystemEvent): void {
    if (event) {
      this.subscriptions.delete(event);
    } else {
      this.subscriptions.clear();
    }
  }

  getStats(): {
    totalSubscriptions: number;
    eventCounts: Record<string, number>;
    recentEvents: Array<{ event: string; timestamp: number }>;
  } {
    const eventCounts: Record<string, number> = {};

    for (const [event, subs] of this.subscriptions.entries()) {
      eventCounts[event] = subs.length;
    }

    return {
      totalSubscriptions: Array.from(this.subscriptions.values()).reduce(
        (sum, subs) => sum + subs.length,
        0
      ),
      eventCounts,
      recentEvents: this.eventHistory.slice(-20),
    };
  }
}

export const eventBus = new EventBus();

import { queryCacheService } from './query-cache-service';
import { logger } from './logger';

eventBus.on('customer:created', (data) => {
  logger.info('Customer created', { customerId: data.id });
});

eventBus.on('customer:updated', (data) => {
  queryCacheService.invalidateCustomer(data.id);
  logger.info('Customer updated - cache invalidated', { customerId: data.id });
});

eventBus.on('project:created', (data) => {
  queryCacheService.invalidateCustomer(data.customerId);
  logger.info('Project created', { projectId: data.id, customerId: data.customerId });
});

eventBus.on('okr:updated', (data) => {
  queryCacheService.invalidateCustomer(data.customerId);
  queryCacheService.invalidateTags(['okr']);
});

eventBus.on('swot:updated', (data) => {
  queryCacheService.invalidateCustomer(data.customerId);
  queryCacheService.invalidateTags(['swot']);
});

eventBus.on('bsc:updated', (data) => {
  queryCacheService.invalidateCustomer(data.customerId);
  queryCacheService.invalidateTags(['bsc']);
});

eventBus.on('invoice:created', (data) => {
  queryCacheService.invalidateCustomer(data.customerId);
  queryCacheService.invalidateTags(['invoices']);
});

eventBus.on('time-entry:created', (data) => {
  queryCacheService.invalidateCustomer(data.customerId);
  queryCacheService.invalidateTags(['time_entries']);
});

eventBus.on('cache:invalidate', (data) => {
  if (data.tags) {
    queryCacheService.invalidateTags(data.tags);
  }
  logger.debug('Manual cache invalidation', { keys: data.keys, tags: data.tags });
});

eventBus.on('error:critical', (data) => {
  logger.fatal('Critical error occurred', data.error, data.context);
});

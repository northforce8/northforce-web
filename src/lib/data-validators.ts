/**
 * Enterprise data validators and normalizers
 * Ensures UI never receives undefined/null for critical fields
 */

import type { EnterprisePlan, Partner, Customer, Project } from './partner-portal-types';

export function normalizeEnterprisePlan(raw: unknown): EnterprisePlan {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid enterprise plan data: not an object');
  }

  const plan = raw as Partial<EnterprisePlan>;

  if (!plan.id) {
    throw new Error('Invalid enterprise plan: missing id');
  }

  return {
    id: plan.id,
    plan_name: plan.plan_name ?? '',
    plan_level: plan.plan_level ?? 'starter',
    credits_per_month: plan.credits_per_month ?? 0,
    price_per_month: plan.price_per_month ?? 0,
    credits_price_per_credit: plan.credits_price_per_credit ?? 0,
    overage_price_per_credit: plan.overage_price_per_credit ?? 0,
    partner_cost_per_credit: plan.partner_cost_per_credit ?? 0,
    max_users: plan.max_users ?? null,
    max_projects: plan.max_projects ?? null,
    features: Array.isArray(plan.features) ? plan.features : [],
    is_active: plan.is_active ?? true,
    created_at: plan.created_at ?? new Date().toISOString(),
    updated_at: plan.updated_at ?? new Date().toISOString(),
  };
}

export function normalizePartner(raw: unknown): Partner {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid partner data: not an object');
  }

  const partner = raw as Partial<Partner>;

  if (!partner.id) {
    throw new Error('Invalid partner: missing id');
  }

  return {
    id: partner.id,
    partner_name: partner.partner_name ?? '',
    partner_company: partner.partner_company ?? null,
    email: partner.email ?? '',
    phone: partner.phone ?? null,
    role: partner.role ?? 'developer',
    hourly_rate: partner.hourly_rate ?? 0,
    is_active: partner.is_active ?? true,
    user_id: partner.user_id ?? null,
    created_at: partner.created_at ?? new Date().toISOString(),
    updated_at: partner.updated_at ?? new Date().toISOString(),
  };
}

export function normalizeCustomer(raw: unknown): Customer {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid customer data: not an object');
  }

  const customer = raw as Partial<Customer>;

  if (!customer.id) {
    throw new Error('Invalid customer: missing id');
  }

  return {
    id: customer.id,
    company_name: customer.company_name ?? '',
    contact_name: customer.contact_name ?? null,
    contact_email: customer.contact_email ?? null,
    contact_phone: customer.contact_phone ?? null,
    industry: customer.industry ?? null,
    status: customer.status ?? 'active',
    enterprise_plan_id: customer.enterprise_plan_id ?? null,
    credits_balance: customer.credits_balance ?? 0,
    created_at: customer.created_at ?? new Date().toISOString(),
    updated_at: customer.updated_at ?? new Date().toISOString(),
  };
}

export function normalizeProject(raw: unknown): Project {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid project data: not an object');
  }

  const project = raw as Partial<Project>;

  if (!project.id) {
    throw new Error('Invalid project: missing id');
  }

  return {
    id: project.id,
    name: project.name ?? '',
    description: project.description ?? null,
    customer_id: project.customer_id ?? '',
    status: project.status ?? 'active',
    priority: project.priority ?? 'medium',
    start_date: project.start_date ?? null,
    end_date: project.end_date ?? null,
    estimated_credits: project.estimated_credits ?? null,
    created_at: project.created_at ?? new Date().toISOString(),
    updated_at: project.updated_at ?? new Date().toISOString(),
  };
}

export function normalizeArray<T>(
  raw: unknown,
  normalizer: (item: unknown) => T
): T[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item, index) => {
      try {
        return normalizer(item);
      } catch (error) {
        console.warn(`Failed to normalize item at index ${index}:`, error);
        return null;
      }
    })
    .filter((item): item is T => item !== null);
}

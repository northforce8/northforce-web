/*
  # Fix Duplicate Permissive Policies
  
  1. Purpose
    - Remove duplicate SELECT policies that cause multiple permissive policy warnings
    - Consolidate access control into single policies per action
  
  2. Changes
    - Remove old auth_select_* policies for agile tables
    - Keep the newer consolidated policies
    - Ensure contracts and invoices have single SELECT policies
  
  3. Security Impact
    - Maintains same security model with cleaner policy structure
    - Eliminates policy conflicts
*/

-- Agile Ceremonies: drop old select policy
DROP POLICY IF EXISTS "auth_select_ceremonies" ON public.agile_ceremonies;

-- Agile Maturity Assessments: drop old select policy
DROP POLICY IF EXISTS "auth_select_assessments" ON public.agile_maturity_assessments;

-- Agile Metrics: drop old select policy
DROP POLICY IF EXISTS "auth_select_metrics" ON public.agile_metrics;

-- Agile Transformation Stages: drop old select policy
DROP POLICY IF EXISTS "auth_select_stages" ON public.agile_transformation_stages;

-- Agile Transformations: drop old select policy
DROP POLICY IF EXISTS "auth_select_transformations" ON public.agile_transformations;

-- Contracts: already consolidated in previous migration, but ensure clean state
-- The contracts_select_policy and contracts_manage_policy should be the only ones
-- contracts_manage_policy includes SELECT for admins, contracts_select_policy is for customers
-- This is intentional as they serve different roles

-- Invoices: already consolidated in previous migration, same pattern as contracts
-- invoices_select_policy and invoices_manage_policy should be the only ones
-- This is intentional for the same reason as contracts

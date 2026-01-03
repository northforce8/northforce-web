/*
  # Fix RLS Policy Performance - Part 3: Financial & Time Tracking

  ## Performance Optimization
  - Replaces `auth.uid()` with `(select auth.uid())` in RLS policies
  - Covers contracts, invoices, time entries, and notes
  - Removes duplicate policies for clarity

  ## Tables Updated
  - contracts, invoice_line_items, invoices
  - time_entries, notes
*/

-- Contracts - remove duplicates and optimize
DROP POLICY IF EXISTS "Admins manage contracts" ON public.contracts;

DROP POLICY IF EXISTS "Admins can manage all contracts" ON public.contracts;
CREATE POLICY "Admins can manage all contracts" ON public.contracts
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view own contracts" ON public.contracts;
CREATE POLICY "Customers can view own contracts" ON public.contracts
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Invoices - remove duplicates and optimize
DROP POLICY IF EXISTS "Admins manage invoices" ON public.invoices;

DROP POLICY IF EXISTS "Admins can manage all invoices" ON public.invoices;
CREATE POLICY "Admins can manage all invoices" ON public.invoices
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view own invoices" ON public.invoices;
CREATE POLICY "Customers can view own invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Invoice Line Items - remove duplicates and optimize
DROP POLICY IF EXISTS "Admins manage invoice items" ON public.invoice_line_items;

DROP POLICY IF EXISTS "Admins can manage all invoice line items" ON public.invoice_line_items;
CREATE POLICY "Admins can manage all invoice line items" ON public.invoice_line_items
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'))
  WITH CHECK ((SELECT auth.uid()) IN (SELECT id FROM public.user_profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Customers can view own invoice line items" ON public.invoice_line_items;
CREATE POLICY "Customers can view own invoice line items" ON public.invoice_line_items
  FOR SELECT TO authenticated
  USING (invoice_id IN (SELECT id FROM public.invoices WHERE customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid()))));

-- Time Entries - remove duplicate and optimize
DROP POLICY IF EXISTS "time_entries_select_policy" ON public.time_entries;

DROP POLICY IF EXISTS "Customers can view time on own projects" ON public.time_entries;
CREATE POLICY "Customers can view time on own projects" ON public.time_entries
  FOR SELECT TO authenticated
  USING (customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid())));

-- Notes - remove duplicate and optimize (uses visibility column, not is_shared_with_customer)
DROP POLICY IF EXISTS "notes_select_policy" ON public.notes;

DROP POLICY IF EXISTS "Customers can view shared notes" ON public.notes;
CREATE POLICY "Customers can view shared notes" ON public.notes
  FOR SELECT TO authenticated
  USING (
    visibility IN ('customer', 'public')
    AND customer_id IN (SELECT customer_id FROM public.user_profiles WHERE id = (SELECT auth.uid()))
  );
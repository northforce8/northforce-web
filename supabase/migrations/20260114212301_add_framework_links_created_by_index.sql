/*
  # Add Framework Links Created By Index
  
  1. Purpose
    - Add missing index for framework_links.created_by foreign key
  
  2. Changes
    - Create index on created_by column
  
  3. Performance Impact
    - Improves query performance for foreign key lookups
*/

CREATE INDEX IF NOT EXISTS idx_framework_links_created_by ON public.framework_links(created_by);

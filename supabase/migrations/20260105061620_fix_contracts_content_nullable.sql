/*
  # Fix Contracts Content Field
  
  1. Changes
    - Make contracts.content nullable to allow contract creation without full content
    - Add default empty string for backward compatibility
  
  2. Notes
    - This enables contract creation via UI forms before content is finalized
    - Content can be populated later during contract review/editing phase
*/

ALTER TABLE contracts 
ALTER COLUMN content DROP NOT NULL;

ALTER TABLE contracts 
ALTER COLUMN content SET DEFAULT '';

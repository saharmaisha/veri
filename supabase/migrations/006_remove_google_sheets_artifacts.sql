alter table if exists public.saved_items
  drop column if exists google_sync_status,
  drop column if exists google_sync_error;

drop table if exists public.google_integrations;

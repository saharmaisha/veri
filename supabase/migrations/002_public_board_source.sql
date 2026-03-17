alter table public.pinterest_boards
  add column if not exists source_type text not null default 'api'
    check (source_type in ('api', 'public_url')),
  add column if not exists source_url text;

create index if not exists idx_boards_source_type
  on public.pinterest_boards(source_type);

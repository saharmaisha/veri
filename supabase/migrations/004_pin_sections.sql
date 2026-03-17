alter table public.pinterest_pins
  add column if not exists section_key text,
  add column if not exists section_name text;

create index if not exists idx_pins_board_section
  on public.pinterest_pins(board_id, section_key);

-- JanSetu AI Production Schema
-- Tables: profiles, complaints, complaint_events, complaint_photos, chat_messages

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, email text, phone text, state text,
  language text default 'en',
  scheme_profile jsonb,
  created_at timestamptz default now()
);

create table complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null, department text, portal_name text, location text,
  description text not null, draft_letter text,
  urgency text default 'medium',
  status text not null default 'draft',   -- draft | filed | escalated | resolved
  portal_reference text, filed_at timestamptz, expected_by timestamptz, resolved_at timestamptz,
  is_demo boolean default false, is_archived boolean default false,
  created_at timestamptz default now()
);

create table complaint_events (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  type text not null,   -- created | filed | reminder | escalated | resolved | archived | restored
  note text, created_at timestamptz default now()
);

create table complaint_photos (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  storage_path text not null,
  kind text default 'before',   -- before | after
  created_at timestamptz default now()
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null, content text not null,
  created_at timestamptz default now()
);

create index on complaints (user_id, created_at desc);
create index on complaint_events (complaint_id, created_at);
create index on complaint_photos (complaint_id);

alter table profiles enable row level security;
alter table complaints enable row level security;
alter table complaint_events enable row level security;
alter table complaint_photos enable row level security;
alter table chat_messages enable row level security;

create policy "own profile" on profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "own complaints" on complaints for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own events" on complaint_events for all
  using (exists (select 1 from complaints c where c.id = complaint_id and c.user_id = auth.uid()))
  with check (exists (select 1 from complaints c where c.id = complaint_id and c.user_id = auth.uid()));
create policy "own photos" on complaint_photos for all
  using (exists (select 1 from complaints c where c.id = complaint_id and c.user_id = auth.uid()))
  with check (exists (select 1 from complaints c where c.id = complaint_id and c.user_id = auth.uid()));
create policy "own chat" on chat_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer set search_path = public;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create private storage bucket 'complaint-photos'
insert into storage.buckets (id, name, public)
values ('complaint-photos', 'complaint-photos', false)
on conflict (id) do nothing;

-- Storage RLS Policies for 'complaint-photos' bucket
create policy "upload own photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'complaint-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "read own photos" on storage.objects for select to authenticated
  using (bucket_id = 'complaint-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "delete own photos" on storage.objects for delete to authenticated
  using (bucket_id = 'complaint-photos' and (storage.foldername(name))[1] = auth.uid()::text);

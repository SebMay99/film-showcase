-- Run this in your Supabase SQL Editor

-- Photos table
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'otro',
  storage_path text not null,
  public_url text not null,
  frame_num text not null default '01',
  created_at timestamptz default now()
);

-- Contact messages table
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table photos enable row level security;
alter table contact_messages enable row level security;

-- Public can read photos
create policy "photos_public_read"
  on photos for select
  using (true);

-- Authenticated (service role) can insert/update/delete photos
create policy "photos_service_insert"
  on photos for insert
  with check (true);

create policy "photos_service_update"
  on photos for update
  using (true);

create policy "photos_service_delete"
  on photos for delete
  using (true);

-- Contact messages: anyone can insert (for the contact form)
create policy "contact_insert"
  on contact_messages for insert
  with check (true);

-- Storage bucket setup (run in Supabase dashboard Storage section)
-- Create a bucket named "portfolio" and set it to PUBLIC

-- Migration v1: add medium, camera, and film metadata columns
alter table photos
  add column if not exists medium text not null default '35mm',
  add column if not exists camera text,
  add column if not exists film_roll text,
  add column if not exists film_iso text,
  add column if not exists film_type text;

-- Migration v2: add description, shot_at; make title optional
alter table photos
  add column if not exists description text,
  add column if not exists shot_at timestamptz;

alter table photos alter column title drop not null;

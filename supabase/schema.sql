create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  enrollment_number text default '',
  date date,
  name text not null,
  qualification text default '',
  address text default '',
  category text default '',
  contact_mobile text not null,
  contact_home text default '',
  email text default '',
  course_name text not null,
  reference text default '',
  other_reference text default '',
  confirm text default 'no' check (confirm in ('yes', 'no')),
  receipt_number text default '',
  office_enrollment_number text default '',
  short_topic1 text default '',
  short_topic2 text default '',
  short_comments1 text default '',
  short_comments2 text default '',
  batch_timing text default '',
  course_fees text default '',
  application_fees text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_date_idx on public.inquiries (date desc);
create index if not exists inquiries_name_idx on public.inquiries (name);
create unique index if not exists inquiries_enrollment_number_unique
  on public.inquiries (enrollment_number)
  where enrollment_number <> '';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

alter table public.inquiries enable row level security;

create policy "Authenticated users can read inquiries"
on public.inquiries for select
to authenticated
using (true);

create policy "Authenticated users can insert inquiries"
on public.inquiries for insert
to authenticated
with check (true);

create policy "Authenticated users can update inquiries"
on public.inquiries for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete inquiries"
on public.inquiries for delete
to authenticated
using (true);

-- Courses table: stores available course names used in the form
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists courses_name_unique on public.courses (lower(name));

alter table public.courses enable row level security;

create policy "Authenticated users can read courses"
  on public.courses for select
  to authenticated
  using (true);

create policy "Authenticated users can insert courses"
  on public.courses for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update courses"
  on public.courses for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete courses"
  on public.courses for delete
  to authenticated
  using (true);

-- Sample courses (will be ignored if duplicates exist)
insert into public.courses (name)
select v from (values
  ('AutoCAD'),('Creo'),('Solidworks'),('Catia'),('NX')
) as t(v)
on conflict do nothing;

-- Sample data for testing: one inquiry row
insert into public.inquiries (
  enrollment_number,
  date,
  name,
  qualification,
  address,
  category,
  contact_mobile,
  contact_home,
  email,
  course_name,
  reference,
  other_reference,
  confirm,
  receipt_number,
  office_enrollment_number,
  short_topic1,
  short_topic2,
  short_comments1,
  short_comments2,
  batch_timing,
  course_fees,
  application_fees
) values (
  'ENR-001',
  '2026-05-26',
  'Test Student',
  'B.Sc',
  '123 Test St',
  'Regular',
  '9999999999',
  '',
  'test@example.com',
  'Sample Course',
  'Website',
  '',
  'yes',
  'RCPT-001',
  'OFF-001',
  'Intro',
  '',
  'No comments',
  '',
  'Morning',
  '1000',
  '100'
);

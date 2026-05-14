create table v1_waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null unique,
  created_at timestamptz not null default now()
);

alter table v1_waitlist enable row level security;

-- No permissive policies. Service role bypasses RLS and retains full access.
-- All writes happen server-side via the service role key only.

create index v1_waitlist_created_at_desc on v1_waitlist (created_at desc);

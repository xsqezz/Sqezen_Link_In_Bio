-- Secure profile badges.
-- Run this once in the Supabase SQL editor for the sqezen project.

create table if not exists public.badge_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profile_badges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null check (badge_id in (
    'staff',
    'helper',
    'premium',
    'verified',
    'donor',
    'bug-hunter',
    'og',
    'summer-2026',
    'winner'
  )),
  awarded_by uuid not null references auth.users(id),
  awarded_at timestamptz not null default timezone('utc', now()),
  primary key (profile_id, badge_id)
);

create index if not exists profile_badges_profile_awarded_idx
  on public.profile_badges (profile_id, awarded_at);

alter table public.badge_admins enable row level security;
alter table public.profile_badges enable row level security;

revoke all on table public.badge_admins from anon, authenticated;
revoke all on table public.profile_badges from anon, authenticated;
grant select on table public.profile_badges to anon, authenticated;

drop policy if exists "Anyone can read assigned badges" on public.profile_badges;
create policy "Anyone can read assigned badges"
  on public.profile_badges
  for select
  using (true);

-- There are intentionally no direct insert, update, or delete policies.
-- Only the SECURITY DEFINER functions below can change assignments.

create or replace function public.is_badge_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.badge_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_badge_admin() from public;
grant execute on function public.is_badge_admin() to anon, authenticated;

create or replace function public.find_badge_profile(target_username text)
returns table (
  id uuid,
  username text,
  display_name text
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  normalized_username text := lower(trim(coalesce(target_username, '')));
begin
  if not public.is_badge_admin() then
    raise exception 'Not authorized to manage badges' using errcode = '42501';
  end if;

  if normalized_username !~ '^[a-z0-9_]{3,24}$' then
    raise exception 'Invalid username' using errcode = '22023';
  end if;

  return query
    select p.id, p.username, p.display_name
    from public.profiles as p
    where p.username = normalized_username
    limit 1;
end;
$$;

revoke all on function public.find_badge_profile(text) from public;
grant execute on function public.find_badge_profile(text) to authenticated;

create or replace function public.set_profile_badge(
  target_username text,
  target_badge_id text,
  grant_badge boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  normalized_username text := lower(trim(coalesce(target_username, '')));
  normalized_badge_id text := lower(trim(coalesce(target_badge_id, '')));
  target_profile_id uuid;
begin
  if not public.is_badge_admin() then
    raise exception 'Not authorized to manage badges' using errcode = '42501';
  end if;

  if normalized_username !~ '^[a-z0-9_]{3,24}$' then
    raise exception 'Invalid username' using errcode = '22023';
  end if;

  if normalized_badge_id not in (
    'staff',
    'helper',
    'premium',
    'verified',
    'donor',
    'bug-hunter',
    'og',
    'summer-2026',
    'winner'
  ) then
    raise exception 'Invalid badge' using errcode = '22023';
  end if;

  select p.id
    into target_profile_id
    from public.profiles as p
    where p.username = normalized_username
    limit 1;

  if target_profile_id is null then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;

  perform pg_advisory_xact_lock(hashtext(target_profile_id::text));

  if coalesce(grant_badge, false) then
    if not exists (
      select 1
      from public.profile_badges
      where profile_id = target_profile_id
        and badge_id = normalized_badge_id
    ) and (
      select count(*)
      from public.profile_badges
      where profile_id = target_profile_id
    ) >= 8 then
      raise exception 'Badge limit reached' using errcode = '22023';
    end if;

    insert into public.profile_badges (profile_id, badge_id, awarded_by)
    values (target_profile_id, normalized_badge_id, auth.uid())
    on conflict (profile_id, badge_id) do nothing;
    return true;
  end if;

  delete from public.profile_badges
  where profile_id = target_profile_id
    and badge_id = normalized_badge_id;
  return false;
end;
$$;

revoke all on function public.set_profile_badge(text, text, boolean) from public;
grant execute on function public.set_profile_badge(text, text, boolean) to authenticated;

-- The legacy profiles.customization.badges value is intentionally not migrated.
-- The frontend ignores it, so old self-selected values cannot become assignments.

-- The administrator is the existing public @sqz profile's Supabase account.
insert into public.badge_admins (user_id)
values ('95109494-ca77-456f-b68c-013d057cc948')
on conflict (user_id) do nothing;

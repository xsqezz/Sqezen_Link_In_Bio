-- Discord presence integration for sqezen.
-- Run this once in the Supabase SQL editor.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.discord_connections (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  discord_id text not null unique check (discord_id ~ '^[0-9]{17,20}$'),
  username text not null check (char_length(username) between 2 and 32),
  global_name text,
  avatar text check (
    avatar is null
    or avatar ~ '^https://cdn\.discordapp\.com/avatars/[0-9]+/[A-Za-z0-9_]+\.(png|jpg|jpeg|webp|gif)(\?.*)?$'
  ),
  public_flags integer not null default 0 check (public_flags >= 0),
  primary_guild_tag text check (primary_guild_tag is null or char_length(primary_guild_tag) <= 64),
  show_widget boolean not null default true,
  show_status boolean not null default true,
  show_activity boolean not null default true,
  show_badges boolean not null default true,
  show_guild_tag boolean not null default true,
  custom_idle_text text check (custom_idle_text is null or char_length(custom_idle_text) <= 120),
  connected_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.discord_presence (
  discord_id text primary key references public.discord_connections(discord_id) on update cascade on delete cascade,
  status text not null default 'offline' check (status in ('online', 'idle', 'dnd', 'offline')),
  custom_status text check (custom_status is null or char_length(custom_status) <= 256),
  custom_status_emoji text check (custom_status_emoji is null or char_length(custom_status_emoji) <= 128),
  activities jsonb not null default '[]'::jsonb check (
    jsonb_typeof(activities) = 'array'
    and jsonb_array_length(activities) <= 10
  ),
  last_seen_at timestamptz,
  synced_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.discord_oauth_states (
  state text primary key check (char_length(state) >= 32),
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  used_at timestamptz,
  check (expires_at > created_at),
  check (used_at is null or used_at >= created_at)
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_connections'
      and column_name = 'user_id'
  ) then
    alter table public.discord_connections rename column user_id to profile_id;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_connections'
      and column_name = 'discord_user_id'
  ) then
    alter table public.discord_connections rename column discord_user_id to discord_id;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_connections'
      and column_name = 'discord_username'
  ) then
    alter table public.discord_connections rename column discord_username to username;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_connections'
      and column_name = 'discord_global_name'
  ) then
    alter table public.discord_connections rename column discord_global_name to global_name;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_connections'
      and column_name = 'discord_avatar_url'
  ) then
    alter table public.discord_connections rename column discord_avatar_url to avatar;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_connections'
      and column_name = 'widget_visible'
  ) then
    alter table public.discord_connections rename column widget_visible to show_widget;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_connections'
      and column_name = 'show_activities'
  ) then
    alter table public.discord_connections rename column show_activities to show_activity;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_presence'
      and column_name = 'discord_user_id'
  ) then
    alter table public.discord_presence rename column discord_user_id to discord_id;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'discord_presence'
      and column_name = 'user_id'
  ) then
    alter table public.discord_presence drop constraint if exists discord_presence_user_id_fkey;
    alter table public.discord_presence drop constraint if exists discord_presence_pkey;
    alter table public.discord_presence drop column user_id;
  end if;
end
$$;

alter table public.discord_connections
  drop constraint if exists discord_connections_user_id_fkey;

alter table public.discord_connections
  drop constraint if exists discord_connections_profile_id_fkey;

alter table public.discord_connections
  add constraint discord_connections_profile_id_fkey
  foreign key (profile_id) references public.profiles(id) on delete cascade;

alter table public.discord_presence
  drop constraint if exists discord_presence_discord_user_id_fkey;

alter table public.discord_presence
  drop constraint if exists discord_presence_discord_id_fkey;

alter table public.discord_presence
  add constraint discord_presence_discord_id_fkey
  foreign key (discord_id) references public.discord_connections(discord_id) on update cascade on delete cascade;

alter table public.discord_presence
  drop constraint if exists discord_presence_pkey;

alter table public.discord_presence
  add constraint discord_presence_pkey primary key (discord_id);

alter table public.discord_connections
  add column if not exists public_flags integer not null default 0;

alter table public.discord_connections
  add column if not exists primary_guild_tag text;

alter table public.discord_connections
  add column if not exists show_badges boolean not null default true;

alter table public.discord_connections
  add column if not exists show_guild_tag boolean not null default true;

alter table public.discord_connections
  add column if not exists custom_idle_text text;

alter table public.discord_presence
  add column if not exists custom_status_emoji text;

alter table public.discord_connections
  alter column public_flags set default 0;

alter table public.discord_connections
  alter column show_widget set default true,
  alter column show_status set default true,
  alter column show_activity set default true,
  alter column show_badges set default true,
  alter column show_guild_tag set default true;

update public.discord_connections
set public_flags = 0
where public_flags is null;

update public.discord_connections
set show_badges = true
where show_badges is null;

update public.discord_connections
set show_guild_tag = true
where show_guild_tag is null;

alter table public.discord_connections
  alter column public_flags set not null,
  alter column show_badges set not null,
  alter column show_guild_tag set not null;

alter table public.discord_connections
  drop constraint if exists discord_connections_profile_id_check,
  drop constraint if exists discord_connections_discord_id_check,
  drop constraint if exists discord_connections_username_check,
  drop constraint if exists discord_connections_avatar_check,
  drop constraint if exists discord_connections_public_flags_check,
  drop constraint if exists discord_connections_primary_guild_tag_check,
  drop constraint if exists discord_connections_custom_idle_text_check;

alter table public.discord_connections
  add constraint discord_connections_discord_id_check
    check (discord_id ~ '^[0-9]{17,20}$'),
  add constraint discord_connections_username_check
    check (char_length(username) between 2 and 32),
  add constraint discord_connections_avatar_check
    check (
      avatar is null
      or avatar ~ '^https://cdn\.discordapp\.com/avatars/[0-9]+/[A-Za-z0-9_]+\.(png|jpg|jpeg|webp|gif)(\?.*)?$'
    ),
  add constraint discord_connections_public_flags_check
    check (public_flags >= 0),
  add constraint discord_connections_primary_guild_tag_check
    check (primary_guild_tag is null or char_length(primary_guild_tag) <= 64),
  add constraint discord_connections_custom_idle_text_check
    check (custom_idle_text is null or char_length(custom_idle_text) <= 120);

alter table public.discord_presence
  drop constraint if exists discord_presence_status_check,
  drop constraint if exists discord_presence_custom_status_check,
  drop constraint if exists discord_presence_custom_status_emoji_check,
  drop constraint if exists discord_presence_activities_check;

alter table public.discord_presence
  add constraint discord_presence_status_check
    check (status in ('online', 'idle', 'dnd', 'offline')),
  add constraint discord_presence_custom_status_check
    check (custom_status is null or char_length(custom_status) <= 256),
  add constraint discord_presence_custom_status_emoji_check
    check (custom_status_emoji is null or char_length(custom_status_emoji) <= 128),
  add constraint discord_presence_activities_check
    check (
      jsonb_typeof(activities) = 'array'
      and jsonb_array_length(activities) <= 10
    );

create index if not exists discord_connections_discord_id_idx
  on public.discord_connections (discord_id);

drop index if exists discord_connections_discord_user_idx;

create index if not exists discord_presence_status_idx
  on public.discord_presence (status, synced_at desc);

create index if not exists discord_oauth_states_user_expiry_idx
  on public.discord_oauth_states (user_id, expires_at desc);

drop trigger if exists touch_discord_connections_updated_at on public.discord_connections;
create trigger touch_discord_connections_updated_at
before update on public.discord_connections
for each row
execute function public.touch_updated_at();

drop trigger if exists touch_discord_presence_updated_at on public.discord_presence;
create trigger touch_discord_presence_updated_at
before update on public.discord_presence
for each row
execute function public.touch_updated_at();

alter table public.discord_connections enable row level security;
alter table public.discord_presence enable row level security;
alter table public.discord_oauth_states enable row level security;

revoke all on table public.discord_connections from anon, authenticated;
revoke all on table public.discord_presence from anon, authenticated;
revoke all on table public.discord_oauth_states from anon, authenticated;

grant select (
  discord_id,
  username,
  global_name,
  avatar,
  public_flags,
  primary_guild_tag,
  show_widget,
  show_status,
  show_activity,
  show_badges,
  show_guild_tag,
  custom_idle_text
) on table public.discord_connections to anon, authenticated;
grant select (
  discord_id,
  status,
  custom_status,
  custom_status_emoji,
  activities
) on table public.discord_presence to anon, authenticated;
grant update (
  show_widget,
  show_status,
  show_activity,
  show_badges,
  show_guild_tag,
  custom_idle_text,
  updated_at
) on table public.discord_connections to authenticated;

grant select, insert, update, delete on table public.discord_connections to service_role;
grant select, insert, update, delete on table public.discord_presence to service_role;
grant select, insert, update, delete on table public.discord_oauth_states to service_role;

drop policy if exists "Owners can read their Discord connection" on public.discord_connections;
create policy "Owners can read their Discord connection"
  on public.discord_connections
  for select
  to authenticated
  using (profile_id = auth.uid());

drop policy if exists "Public can read visible Discord widgets" on public.discord_connections;
create policy "Public can read visible Discord widgets"
  on public.discord_connections
  for select
  to anon, authenticated
  using (show_widget);

drop policy if exists "Owners can update Discord display settings" on public.discord_connections;
create policy "Owners can update Discord display settings"
  on public.discord_connections
  for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "Owners can read their Discord presence" on public.discord_presence;
create policy "Owners can read their Discord presence"
  on public.discord_presence
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.discord_connections as c
      where c.discord_id = discord_presence.discord_id
        and c.profile_id = auth.uid()
    )
  );

drop policy if exists "Public can read visible Discord presence" on public.discord_presence;
create policy "Public can read visible Discord presence"
  on public.discord_presence
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.discord_connections as c
      where c.discord_id = discord_presence.discord_id
        and c.show_widget
        and (c.show_status or c.show_activity)
    )
  );

drop policy if exists "Service role can manage Discord OAuth states" on public.discord_oauth_states;
create policy "Service role can manage Discord OAuth states"
  on public.discord_oauth_states
  for all
  to service_role
  using (true)
  with check (true);

-- Direct authenticated inserts/deletes are intentionally disabled.
-- The edge function and presence bot should use the service role key.

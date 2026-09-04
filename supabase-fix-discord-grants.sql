-- Fix: public Discord widget returns 42501 "permission denied for table discord_connections".
--
-- Cause: the anon/authenticated Postgres roles never received the column-level
-- GRANT SELECT statements from supabase-discord.sql (lines ~300-337), even though
-- the RLS policies for public reads exist. Postgres checks table/column privileges
-- BEFORE row-level security policies, so RLS alone is not enough.
--
-- How to apply: open the Supabase SQL Editor for this project
-- (https://supabase.com/dashboard/project/wzdxgmzwxzfhegelqugy/sql/new),
-- paste this whole file, and click "Run". It only re-applies privileges;
-- it does not touch table structure or data, so it is safe to run any time.

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

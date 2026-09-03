# Discord presence bot setup

1. Run `supabase-discord.sql` in the Supabase SQL editor.
2. Create a Discord app + bot in the Discord Developer Portal.
   - OAuth2 redirect: set your deployed `discord-oauth` Edge Function URL
   - After the callback succeeds or fails, the function redirects to `https://sqezen.lol/dashboard?discord=connected|error` by default
   - Scopes: `identify` for user linking, `bot` for the presence bot invite
   - Bot permissions: no privileged guild permissions are required beyond joining the server
   - Enable the Presence Intent and Server Members Intent
3. Set Supabase Edge Function secrets:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `DISCORD_OAUTH_REDIRECT_URI`
   - optional `DISCORD_DASHBOARD_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy the function:
   - set `supabase/config.toml` with `[functions.discord-oauth] verify_jwt = false`
   - or deploy with `supabase functions deploy discord-oauth --no-verify-jwt`
   - Discord callback GET requests need `verify_jwt = false`
   - POST actions still enforce Supabase auth in the function code via Bearer token lookup
5. Bot env vars:
   - Node.js 22 or newer
   - `DISCORD_BOT_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - optional `DISCORD_GUILD_ID`
   - optional `TRACKED_IDS_REFRESH_MS`
6. Install + run the bot:
   - `npm install`
   - `npm start`
7. Invite the bot to the central Discord server and have linked users join that same server.

For unattended hosting, the repository includes `.github/workflows/discord-presence.yml`.
Add `DISCORD_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` as repository Actions secrets.
The workflow starts the bot automatically every five hours and keeps each run below the
GitHub-hosted runner limit. The bot must still be installed in the Discord server.

Notes:
- Preferred flow: frontend POSTs `{ "action": "authorize" }`, receives `{ "url": "..." }`, sends the browser there, Discord calls the Edge Function with GET, and the function 303 redirects to the dashboard with `?discord=connected` or `?discord=error`.
- `authorize` returns `{ "url": "..." }` for the Discord consent URL.
- `DISCORD_OAUTH_REDIRECT_URI` must be the Edge Function callback URL registered with Discord.
- `DISCORD_DASHBOARD_URL` defaults to `https://sqezen.lol/dashboard`; the function appends `discord=connected` or `discord=error`.
- The function returns the owner's `connection` and `presence` using the frontend column contract (`profile_id`, `discord_id`, `username`, `global_name`, `avatar`, `public_flags`, `primary_guild_tag`, `show_widget`, `show_status`, `show_activity`, `show_badges`, `show_guild_tag`, `custom_idle_text`, plus presence fields).
- Only public identity fields are stored. OAuth tokens are exchanged server-side and never persisted.
- Anonymous public reads are allowed by RLS only for visible widget/presence rows.
- Presence is only visible while the bot can observe the linked user in the configured guild(s).
- If a user leaves the tracked server or disables Discord presence visibility, the stored status will fall back to offline on the next sync.
- `primary_guild_tag` may remain null if Discord does not return that public field through `identify`.

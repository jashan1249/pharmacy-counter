# Switching on accounts (Supabase), step by step

Until these steps are done, the site works in local mode: no login, records saved only on each computer.
It takes about 10 minutes. Supabase is free at beta size.

## 1. Create the Supabase project
1. Go to https://supabase.com and click **Start your project**. Sign up with GitHub (easiest).
2. Click **New project**.
   - Name: `pharmacy-counter`
   - Database password: click **Generate a password** and save it somewhere safe.
   - Region: **Mumbai (ap-south-1)**, closest to your shops.
3. Click **Create new project** and wait about 2 minutes.

## 2. Create the database tables
1. In the left menu open **SQL Editor**, then **New query**.
2. Open `supabase/schema.sql` from this repository, copy everything, paste it in, and press **Run**.
3. You should see "Success. No rows returned".

## 3. Email settings for the beta
1. Open **Authentication → Sign In / Providers → Email**.
2. Turn **Confirm email** OFF for the beta and save.
   (The free plan can only send a few emails per hour. With it on, new shops may wait a long time for their confirmation email.
   Turn it back on later with your own email sender under Authentication → Emails → SMTP.)

## 4. Website address
1. Open **Authentication → URL Configuration**.
2. **Site URL**: `https://jashan1249.github.io/pharmacy-counter/`
3. **Redirect URLs** → Add: `https://jashan1249.github.io/pharmacy-counter/login.html`
4. Save. (This makes "Forgot password" emails open the right page.)

## 5. Connect the website
1. Open **Project Settings → API** (or **API Keys**).
2. Copy the **Project URL** and the **anon public** key.
3. Put them in `assets/config.js`:
   ```js
   supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
   supabaseAnonKey: 'eyJhbGciOi...',
   whatsapp: '91XXXXXXXXXX',
   ```
   The anon key is meant to be public. Shop data is protected by the database rules from step 2.
   Never put the **service_role** key here.
4. Commit the change. GitHub Pages updates in about a minute.

## 6. Make yourself admin
1. Go to the website and create your own account (Start free).
2. In Supabase **SQL Editor** run (with your email):
   ```sql
   insert into public.admins(email) values ('your-email@example.com');
   ```
3. Open `https://jashan1249.github.io/pharmacy-counter/admin.html` to see all shops.

## Good to know
- Free plan limits: 500 MB database, 50,000 monthly users. Plenty for the beta.
- A free project pauses after 7 days with no activity at all. Any shop using it keeps it awake. If it pauses, click **Restore** in Supabase.
- Supabase does not back up free projects. Shops' records also live on their own computers, plus a 14-day daily copy in the `shop_backups` table.

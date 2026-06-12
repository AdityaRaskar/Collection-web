# HotWheels Collection

Personal collection manager built with React, Vite, Tailwind, and Supabase.

Quick start

1. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Install dependencies:

```powershell
npm install
npm run dev
```

3. To run migrations, use Supabase CLI or run SQL from `supabase/migrations/001_init.sql`.

Deployment

1. Build the app:

```powershell
npm run build
```

2. Deploy to GitHub Pages (homepage is configured to root):

```powershell
npm run deploy
```

Supabase setup

- Create a Supabase project and add the `supabase/migrations/001_init.sql` schema to your database (Supabase SQL editor or CLI).
- Create a Storage bucket named `car-images` (or `car-images` as used in code). Ensure public access or generate signed URLs as desired.
- Create admin users and set a custom JWT `role` claim to `admin` for users that should be allowed to write. RLS policies check for this claim.

Admin setup (recommended)

- You can either assign admin rights by setting a custom JWT claim `role = admin`, or by using the `admins` table (recommended for clarity).
- To use the `admins` table, run the SQL in `supabase/migrations/002_admins.sql` (included). Then add an admin row with your Supabase `auth.uid()`:

```sql
insert into public.admins (uid) values ('<your-auth-uid>');
```

Retrieve the `uid` of a user from the Supabase Authentication dashboard (Users list) and insert it into the `admins` table. The RLS policies allow writes when either the JWT claim `role = admin` is present or the user's `uid` exists in `public.admins`.

Environment variables

- `VITE_SUPABASE_URL` - your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - anon/public API key

Notes
- RLS policies in `supabase/migrations/001_init.sql` expect an admin JWT claim; configure Supabase auth hooks or issue custom tokens for admin user management.

Notes
- This scaffold includes initial types, services, and SQL migration with RLS policies.

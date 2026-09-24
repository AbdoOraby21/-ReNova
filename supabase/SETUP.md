# ReNova — Supabase Backend Setup (products + image storage)

The app code is already integrated. You only need to provision the
Supabase project once, then give the frontend its public credentials.

## 1. Create the project (supabase.com)

1. New project → copy the **Project URL** and the **anon public key**
   (Project Settings → API). Never use the `service_role` key in the app.

## 2. Create tables, policies, bucket & seed data

1. Open **SQL Editor** → New query.
2. Paste the full contents of `supabase/schema.sql` and run it.
3. This creates:
   - `public.categories` + `public.products` (with `updated_at` trigger + indexes)
   - RLS enabled: **public read** for everyone, **writes for signed-in admins only**
   - Storage bucket `product-images` (public) with public-read + admin-write policies
   - 11 e-waste categories + 10 realistic seed products (real DB rows, editable
     from the Admin Dashboard — not mock data)

## 3. Create the admin Auth user

Writes (create / edit / delete / image upload) require a signed-in session:

1. **Authentication → Users → Add user → Create new user**
2. Email: `admin@renova.demo`, password of your choice
3. The Admin Dashboard signs into Supabase with these same credentials.

## 4. Connect the frontend (local, never committed)

`.env` is gitignored. Create it in the project root:

```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then `npm run dev`. Without these vars the catalog shows a
"database not configured" state instead of fake data.

## 5. Verify the full flow

1. Admin Dashboard → Products → create a product with a JPG/PNG/WEBP image.
2. Public home page shows it immediately (no code change).
3. Refresh / other browser / other device → still there.
4. Edit → changes appear publicly. Delete → disappears publicly.

## Notes

- Upload validation: JPG/JPEG/PNG/WEBP, max 5MB (`src/lib/productImages.ts`).
- Product images are stored in the `product-images` bucket; the DB keeps the
  public URL (`image_url`). Deleting a product best-effort removes its file.
- Auth/requests demo data (users, carts, orders) still uses local stores —
  only the product system was migrated, per scope.

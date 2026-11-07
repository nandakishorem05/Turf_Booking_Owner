# Owner app

Runs independently on port 3001. Add Supabase middleware that requires an authenticated `owner` profile before production. Database RLS limits each owner to their own turfs, bookings, and financial records.

For Android run `npx cap add android`, `npx cap sync`, then open the generated project in Android Studio........

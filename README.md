# Al-Noor Model School - Online Admission (Demo)

React + Vite single-page site. Applications are stored in Supabase (Postgres) with Row Level Security: the public can only **insert**; nobody can read data from the browser.

## Run locally
```
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Deploy
Push to `main`; Vercel builds with `npm run build` (output `dist`). Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel -> Settings -> Environment Variables.

## Data
Table `public.admission_applications` (see Supabase). View submissions in the Supabase dashboard -> Table Editor.

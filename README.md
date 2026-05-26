# IDBMI React Inquiry App

React + Supabase replacement for the original PHP inquiry form project.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. In Supabase Authentication, add admin users with email and password.
4. Copy `.env.example` to `.env` and fill in your Supabase URL and anon key.
5. Install and run:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Pages

- `/login` - Supabase email/password login
- `/inquiries/new` - create inquiry
- `/inquiries` - all students table with search, edit, delete, print navigation
- `/inquiries/:id/edit` - update inquiry
- `/inquiries/:id/print` - print form matching the original display form

# Elly — Portfolio

Personal portfolio website built with React + Vite, featuring a terminal-inspired boot sequence, project showcase, skills visualization, and a contact form powered by Supabase.

## Tech Stack

- **Frontend:** React 18, Vite 5
- **Backend:** Supabase (PostgreSQL)
- **Fonts:** JetBrains Mono, Sora
- **Deploy:** Vercel

## Features

- Terminal-style boot animation
- Interactive project cards with expand-on-hover
- Filterable skill bars with animated progress
- Contact form that saves to Supabase `contacts` table
- Fully responsive, dark-theme design

## Getting Started

```bash
npm install
npm run dev
```

## Deploy

Connected to Vercel for automatic deployments on push to `main`.

## Supabase Setup

Create a `contacts` table:

```sql
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);
```

## Author

**Elly Rezende**
- [LinkedIn](https://linkedin.com/in/adrielly-rezende)
- [GitHub](https://github.com/elly-rezende)

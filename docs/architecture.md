# Architecture Overview

This document describes the high-level architecture for the HotWheels Collection application.

Principles
- Clean, layered architecture (UI -> services -> data)
- Keep concerns separated: UI components, hooks, services, and types
- Progressive enhancement: public read-only browsing by default, admin capabilities enabled after auth

Layers
- UI (React + Tailwind): components, pages, layout
- State (React Query): server state, caching, pagination
- Services: `src/services/supabase.ts` wraps Supabase client and storage interactions
- Types: shared TypeScript interfaces in `src/types`
- Data: Supabase PostgreSQL with JSONB for `extra_attributes`, Supabase Storage for images

Security
- Supabase Auth for authentication
- Row Level Security (RLS) policies in migrations to enforce server-side authorization

Scalability & Extensibility
- Database uses normalized tables for common queries and `extra_attributes` JSONB for flexibility
- Images stored in Supabase Storage; `car_images` table holds metadata and ordering
- Components are small and reusable to allow growth (dashboard, wishlist, PWA later)

Deployment
- Frontend: GitHub Pages via `gh-pages` or other static host
- Backend: Supabase (managed Postgres + Storage + Auth)

Next steps
- Implement data access hooks with React Query
- Implement image upload flows to Supabase Storage
- Complete admin forms and RLS testing

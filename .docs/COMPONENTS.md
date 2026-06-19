# Component Map

## Pages
- AuthPage        → Login & Register form
- HomePage        → Main page berisi wheel + menu manager

## Components
- SpinWheel       → SVG/Canvas wheel dengan Framer Motion
- MenuManager     → Input tambah menu + list menu
- MenuItem        → Single item di list (dengan tombol hapus)
- ResultModal     → Dialog/modal hasil spin
- NavBar          → Top navigation + user info

## Hooks
- useAuth         → Supabase auth state
- useMenuList     → CRUD menu ke Supabase

## Lib
- supabase.js     → Supabase client init
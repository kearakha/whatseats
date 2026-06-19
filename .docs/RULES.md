# Coding Rules

## General
- Gunakan functional components + hooks, tidak ada class components
- Semua async menggunakan async/await, bukan .then()
- Tidak ada hardcoded string — gunakan constants atau env variables

## File Naming
- Components: PascalCase (SpinWheel.jsx)
- Hooks: camelCase dengan prefix "use" (useMenuList.js)
- Utils: camelCase (formatMenu.js)

## Styling
- Tailwind utility classes untuk semua styling
- Tidak ada inline style kecuali untuk dynamic values (animasi)
- CSS variables untuk design tokens (navy, white, glass effect)

## Supabase
- Semua query Supabase di dalam hooks atau lib/supabase.js
- Tidak ada Supabase call langsung di dalam component

## DO
- Pisahkan logic ke custom hooks
- Handle loading & error state di setiap fetch

## DON'T
- Jangan taruh business logic di dalam JSX
- Jangan commit .env file
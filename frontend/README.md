# ArtLoop · Frontend

SPA en React 19 + Vite + Tailwind v4. Consulta el [README raíz](../README.md) para
una descripción del producto, arquitectura del backend y plan de despliegue.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Variables de entorno

Crea un archivo `.env` con:

```env
VITE_API_BASE_URL=http://localhost:5001
```

Si la variable no está presente, el cliente apunta a la API de producción.

## Estructura

```
src/
├── App.jsx               shell con router de alto nivel
├── api/client.js         fetch wrapper con cache, errores tipados y base URL configurable
├── hooks/                useDrops, useCurrency, useCountdown, useRouter
├── utils/format.js       Intl.NumberFormat, slugify, formatRemaining
├── components/           Navbar, Hero, DropCard, Countdown, Skeleton, Toast, ...
└── pages/                HomePage, ArtworkPage, ArtistPage, AdminPage
```

## Sistema de diseño

- Tokens definidos con `@theme` en `src/index.css` (Tailwind v4).
- Tipografía dual: Space Grotesk (display) + Inter (body) con `display=swap`.
- Mesh gradient + grid sutil de fondo, glassmorphism y motion respetuoso de
  `prefers-reduced-motion`.

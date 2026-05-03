# ArtLoop

Mercado curado de arte de edición limitada con validación de precio en tiempo real.
Cada print fine-art vendido incrementa el valor implícito de la pieza original, generando
un mecanismo transparente de price-discovery para coleccionistas y artistas.

```
artloop/
├── backend/    Node.js + Express 5 + Firestore (API REST)
└── frontend/   React 19 + Vite + Tailwind v4 (SPA)
```

---

## Backend

Arquitectura modular en `backend/src/`:

```
src/
├── server.js              entrypoint con graceful shutdown
├── app.js                 ensamblado del Express app
├── config/                env config + Firebase singleton
├── middleware/            auth, validate, errores centralizados
├── routes/                drops, admin, health
├── services/              lógica de negocio (transacciones Firestore)
├── validators/            esquemas Zod
├── utils/                 logger estructurado, ApiError, asyncHandler
└── scripts/seed.js        catálogo inicial
```

**Hardening aplicado**

| Capa | Implementación |
|------|----------------|
| Security headers | `helmet` con `cross-origin-resource-policy: cross-origin` |
| Compresión | `compression` middleware |
| CORS | Allowlist explícita por env (`CORS_ORIGINS`) |
| Rate limit | 240 req/min global · 20 req/min en `/api/admin/*` |
| Auth admin | Header `x-admin-token` con comparación constante (`crypto.timingSafeEqual`) |
| Validación | `zod` en body / params; respuestas 400 con detalle de issues |
| Logs | JSON estructurado en producción · color en dev · access logs `morgan` |
| Errores | Handler central · jamás expone stack traces · errores tipados (`ApiError`) |
| Concurrencia | `db.runTransaction()` en `buyPrint` para evitar oversell |
| Shutdown | SIGINT/SIGTERM cierran el server con timeout de 10 s |

### Variables de entorno

Copia `backend/.env.example` a `backend/.env` y completa los valores. Las claves clave:

| Variable | Uso |
|----------|-----|
| `PORT` | Puerto HTTP (default 5001) |
| `NODE_ENV` | `production` / `development` |
| `CORS_ORIGINS` | Lista separada por comas. Usa `*` solo en dev |
| `ADMIN_TOKEN` | Token largo opaco. Genera con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PRINT_BID_INCREMENT` | USD que sube el original por cada print vendido (default 125) |
| `MAX_BODY_MB` | Límite del payload JSON (default 8) |
| `FIREBASE_CONFIG` | JSON completo del service-account (en producción). En dev deja vacío y usa `serviceAccount.json` |

### Comandos

```bash
cd backend
cp .env.example .env        # luego edítalo con tu token y service-account
npm install
npm run dev                 # nodemon, recarga al cambiar src/
npm start                   # producción
npm run seed                # carga el catálogo demo
```

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Liveness/readiness probe |
| GET | `/api/drops` | Lista de obras (orden descendente por `createdAt`) |
| GET | `/api/drops/:id` | Detalle de una obra |
| POST | `/api/drops/:id/buy-print` | Reserva atómica de un print |
| POST | `/api/admin/add-drop` | Publica una obra · requiere `x-admin-token` |

Todos los errores siguen el contrato:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "issues": [...] } }
```

---

## Frontend

SPA en `frontend/src/`:

```
src/
├── App.jsx                shell + router de alto nivel
├── main.jsx               entrypoint React 19
├── index.css              tokens de diseño Tailwind v4 + utilidades
├── api/client.js          fetch wrapper con cache, errores tipados, base URL configurable
├── hooks/                 useDrops · useCurrency · useCountdown · useRouter (hash)
├── utils/format.js        formateo de precios, slugs, tiempos restantes
├── components/            Navbar · Footer · Hero · DropCard · Toast · Skeleton · ...
└── pages/                 HomePage · ArtworkPage · ArtistPage · AdminPage
```

**Sistema de diseño**

- Tipografía dual: **Space Grotesk** (display) + **Inter** (body) servidas con `display=swap`.
- Paleta principal: deep canvas (`#07040d`) con acentos magenta/cyan/aurum.
- Mesh gradient + grid sutil de fondo para profundidad sin saturar.
- Glassmorphism para superficies elevadas (`.glass`) y un sistema de botones (`.btn-primary`, `.btn-ghost`).
- Animaciones definidas con `prefers-reduced-motion` respetado.

**UX que se añadió**

- Hash router (`#/`, `#/drop/:id`, `#/artist/:slug`, `#/admin`) — URLs compartibles y back-button funcional.
- Countdown real por obra (`endsAt` desde el backend) con actualización segundo a segundo.
- Skeleton loaders en grilla y detalle.
- Toast notifications (success / error / info) en lugar de `alert()`.
- Selector de moneda persistido en `localStorage` con formateo `Intl.NumberFormat` por locale.
- Panel admin protegido por token (almacenado solo en `sessionStorage`) con validación de formulario.
- Página de artista con avatar generado a partir de iniciales y gradiente de marca.
- Accesibilidad: focus rings, `aria-label`s en navegación, contraste verificado, soporte de teclado.
- SEO: meta-description, Open Graph, theme-color, locale `es`.

### Variables de entorno

Crea `frontend/.env` para apuntar a tu backend local:

```env
VITE_API_BASE_URL=http://localhost:5001
```

Si la variable no se define, el cliente apunta a `https://artloop-mvp.onrender.com` (producción).

### Comandos

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

---

## Despliegue sugerido

1. **Backend** en Render / Fly / Railway — define `NODE_ENV=production`, `ADMIN_TOKEN`, `CORS_ORIGINS=https://tu-dominio` y pega el service-account de Firebase en `FIREBASE_CONFIG`.
2. **Frontend** en Vercel / Netlify / Cloudflare Pages — configura `VITE_API_BASE_URL=https://api.tu-dominio`.
3. Asegúrate de que `serviceAccount.json` y `.env` permanezcan ignorados por git (ya lo están en `.gitignore`).

---

## Roadmap técnico recomendado

- Migrar a TypeScript en `backend/src` y `frontend/src`.
- Capa de pagos real (Stripe / MercadoPago) reemplazando `buyPrint`.
- Tests con `vitest` (frontend) y `supertest` (backend) sobre los handlers críticos.
- Webhooks de Firestore → cola → recálculo de `originalBid` para soportar múltiples reglas de precio.
- Internacionalización con `react-intl` y traducción de copy.

---

© 2026 ArtLoop · Hecho en Chile.

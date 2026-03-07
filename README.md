# Admin Dashboard Handoff (for Claude)

This is the real admin panel contract and structure. Use this document instead of generic Vite template assumptions.

## 1) Tech Stack
- React 19 + Vite
- React Router
- Redux Toolkit
- Tailwind + DaisyUI
- Main accent color: `warning`

## 2) Environment Variable
- `VITE_BACKENT_URL` (required)

Example:
```env
VITE_BACKENT_URL=https://black-phoenixx-backend.onrender.com
```

## 3) Start / Build
```bash
npm install
npm run dev
npm run build
npm run preview
```

## 4) Routing Architecture
Main router is in `src/main.jsx`.

Protected app layout:
- `/` -> Dashboard
- `/products`
- `/orders`
- `/workers`
- `/wallet`
- `/profile`
- `/swiper`

Auth routes:
- `/login`
- `/register`

Guards:
- `ProtectedRoute` for authenticated pages
- `AuthRoute` for login/register

## 5) Layout Structure
- `App.jsx` is shell layout:
  - desktop sidebar
  - fixed top navbar
  - mobile bottom navigation
- Reusable components:
  - `Sidebar.jsx`
  - `Navbar.jsx`
  - `LoadingTemplate.jsx`
  - `AppToast.jsx`
  - `WorkerModal.jsx`
  - `WorkerTable.jsx`

## 6) API Usage Contract (Admin)
Admin relies on backend endpoints:
- Auth:
  - `POST /api/auth/login`
- Products:
  - `GET/POST /api/product`
  - `PUT/PATCH/DELETE /api/product/:id`
- Orders:
  - `GET /api/orders`
  - `GET /api/orders/stats`
  - `PATCH /api/orders/:id/status`
  - `PATCH /api/orders/:id/payment`
  - `DELETE /api/orders/:id`
- Swiper:
  - `GET/POST /api/swiper`
  - `PUT/DELETE /api/swiper/:id`
- Workers:
  - `GET/POST /api/workers`
  - `PUT/DELETE /api/workers/:id`

## 7) State Management
- Redux store in `src/redux/store.js`
- Auth state in `src/redux/slices/authSlice.js`
  - localStorage keys:
    - `token`
    - `user`

## 8) Important UI Rules
1. Keep warning color as primary accent.
2. Keep dashboard responsive with current sidebar/navbar behavior.
3. Do not remove existing page routes, names, or API base behavior.
4. Keep mobile nav usable and consistent.

## 9) Known Mismatch / Caution
1. `Register.jsx` is local-only style and not fully backend-integrated.
2. `Banners.jsx` has references to `/api/gallery` in addition to `/api/swiper`.
3. Some pages are large; refactor only if behavior is preserved.

## 10) Non-Breaking Rules for Claude
1. Do not break `VITE_BACKENT_URL` usage pattern.
2. Do not rename or remove existing admin routes.
3. Keep API request shapes compatible with current backend responses.
4. Preserve warning-themed design language.

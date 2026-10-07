# Cedar Olive

A full-stack home decor store. The client is a React storefront and admin dashboard. The API is an Express service with authentication, products, orders, reviews, wishlist, and contact messages.

## Stack

**Client**

- React 19 and Vite
- React Router
- Redux Toolkit with persisted cart and user state
- TanStack Query for server data
- Tailwind CSS

**API**

- Node.js and Express
- MongoDB and Mongoose
- JWT authentication
- Stripe checkout
- Cloudinary for product images

## Run it locally

Use two terminals.

```bash
# API
cd cedar-olive-store
cp config.env.example config.env   # if you keep secrets out of git
npm install
npm run start:dev
```

```bash
# Client
cd CedarOlive-Store
npm install
npm run dev
```

The client reads `VITE_API_URL` from `CedarOlive-Store/.env`.

```
VITE_API_URL=http://localhost:8000
```

## How the client is organized

```
src/
  api/                  HTTP clients and React Query hooks
  redux/                cart, auth, and form state
  components/ui/        shared controls
  components/layout/    store header, footer, and auth shell
  features/             home, catalog, profile, and admin screens
  pages/                route entry points
```

Pages stay thin. Shared buttons, fields, and dialogs live in `components/ui`. Store pages render inside one layout, so the header and footer are not copied onto each screen. Admin is a separate shell.

## Scripts

| Command | Where | What it does |
| --- | --- | --- |
| `npm run dev` | client | Start Vite |
| `npm run build` | client | Production build |
| `npm run start:dev` | API | Start the API with nodemon |

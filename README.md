# QuickCart — MERN Stack Product Catalog

A product catalog app converted from a static React frontend into a full MERN stack application. Supports full CRUD (Create, Read, Update, Delete) on products via an Express + MongoDB Atlas backend, with the original UI/UX kept visually unchanged.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (via Mongoose)

## Project Structure

```
quickcart-mern-app/
├── frontend-mern/     # React app (Vite)
│   └── src/
│       ├── App.jsx       # Main app: state, fetch logic, admin panel
│       └── products.js   # UI constants (categories, brands, sort options)
└── server/            # Express + MongoDB backend
    ├── server.js         # Entry point, connects to Mongo, mounts routes
    ├── models/Product.js # Mongoose schema
    ├── routes/products.js # CRUD routes
    └── seed.js           # One-time script to load initial product data
```

## Prerequisites

- Node.js (v18+ recommended)
- A MongoDB Atlas account with a cluster set up, and a connection string (URI)

## Setup

### 1. Backend (`server/`)

```
cd server
npm install
```

Create a `.env` file inside `server/` (same folder as `server.js`) with:

```
MONGO_URI=<your MongoDB Atlas connection string>
PORT=5000
```

`.env` is gitignored — it is never committed, and you'll need to create it yourself on any machine you clone this repo to.

Seed the database with the initial product set (run once):

```
npm run seed
```

Start the backend:

```
npm start
```

You should see:

```
Connected to MongoDB Atlas
Server running on http://localhost:5000
```

### 2. Frontend (`frontend-mern/`)

In a separate terminal:

```
cd frontend-mern
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The backend must already be running for products to load — if it isn't, the app shows a "could not reach the server" message instead of the catalog.

## Features

- **Browse:** search, filter by category/brand/rating/price, sort by price or rating — all client-side against data fetched from MongoDB.
- **Cart:** add/remove items, adjust quantity, view running total.
- **Manage (admin):** click **Manage** in the header to:
  - Add a new product via the form.
  - Click an existing product in the list to load it into the form and edit it.
  - Delete a product via the trash icon on its card in the main grid.

There is no authentication on the admin/manage routes — anyone with the app open can add, edit, or delete products. This is a known and accepted gap for this lab exercise, not an oversight.

## API Endpoints

| Method | Endpoint             | Description           |
|--------|-----------------------|------------------------|
| GET    | `/api/products`       | List all products      |
| GET    | `/api/products/:id`   | Get a single product    |
| POST   | `/api/products`       | Create a new product    |
| PUT    | `/api/products/:id`   | Update a product        |
| DELETE | `/api/products/:id`   | Delete a product        |

## Notes

- The frontend's product ID field maps to a custom numeric `id` in MongoDB, not Mongo's default `_id`.
- Re-running `npm run seed` will re-insert the original product set — use with care if you've since added/edited/deleted data through the app, as it does not clear existing documents first (check `seed.js` if you need it to reset the collection instead of appending).

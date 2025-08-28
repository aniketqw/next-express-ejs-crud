# Next.js + Express (EJS) — Simple CRUD

This is a **working starter** that shows a basic CRUD for **posts** with:
- **Backend**: Express + EJS (server-side rendered pages at `http://localhost:4000`) and JSON API under `/api`.
- **Frontend**: Next.js (at `http://localhost:3000`) consuming the JSON API.

## Quick start

### 1) Install dependencies
In two terminals, run:

```bash
# Terminal A (backend)
cd api
npm install
npm run dev

# Terminal B (frontend)
cd web
npm install
npm run dev
```

- Express API & EJS app runs on **http://localhost:4000**
- Next.js app runs on **http://localhost:3000** (talks to the API on port 4000)

### 2) API Routes (JSON)
- `GET /api/posts` — list all posts
- `GET /api/posts/:id` — get one
- `POST /api/posts` — create (expects JSON `{ title, body }` or URL-encoded body)
- `PUT /api/posts/:id` — update
- `DELETE /api/posts/:id` — delete

### 3) EJS Routes (server-rendered)
- `GET /posts` — list
- `GET /posts/new` — new form
- `POST /posts` — create (form)
- `GET /posts/:id` — show
- `GET /posts/:id/edit` — edit form
- `PUT /posts/:id` — update
- `DELETE /posts/:id` — delete

> Data is stored in a simple JSON file at `api/data/posts.json` for demo purposes.

---

## Notes
- CORS is enabled on the API for the Next.js app.
- For PUT/DELETE from EJS forms, we use the `method-override` query/body key `_method`.
- This is intentionally minimal so you can extend to databases (e.g., Prisma + SQLite/Postgres).

Happy hacking! 🎉

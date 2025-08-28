# Next.js + Express (EJS) — Simple CRUD

This is a working starter that demonstrates a basic CRUD for posts with two apps that run side-by-side:
- Backend: Express + EJS (server-rendered pages at http://localhost:4000) and a JSON API under /api.
- Frontend: Next.js (at http://localhost:3000) that calls the API. During SSR, Next rewrites /api/* requests to the Express API.

How it works
- Data store: A simple JSON file at api/data/posts.json used by the Express routes as in-memory storage.
- Express app (api/): Provides two sets of routes:
  - EJS routes (/posts, /posts/:id, forms) rendered on the server for quick CRUD via HTML.
  - JSON API routes (/api/...) used by the Next.js frontend.
- Next.js app (web/):
  - next.config.js rewrites /api/* to http://localhost:4000/api/* in development/production.
  - web/lib/api.js wraps fetch. On the server it uses an absolute URL based on NEXT_ORIGIN (defaults to http://127.0.0.1:3000) so SSR fetches hit Next first and are rewritten to the API.

Quick start (local dev)
1) Install dependencies in two terminals and run in dev mode:

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

- Express API & EJS app: http://localhost:4000
- Next.js app: http://localhost:3000 (talks to the API on port 4000 via rewrites)

API Routes (JSON)
- GET /api/posts — list all posts
- GET /api/posts/:id — get one
- POST /api/posts — create (expects JSON { title, body } or URL-encoded body)
- PUT /api/posts/:id — update
- DELETE /api/posts/:id — delete

EJS Routes (server-rendered)
- GET /posts — list
- GET /posts/new — new form
- POST /posts — create (form)
- GET /posts/:id — show
- GET /posts/:id/edit — edit form
- PUT /posts/:id — update
- DELETE /posts/:id — delete

Docker/Podman
This repo includes a single Dockerfile that builds both apps and runs them in one container (ports 3000 for Next, 4000 for Express).

Build the image:
```bash
# Docker
docker build -t next-express-ejs-crud .
# Or Podman
podman build -t next-express-ejs-crud .
```

Run with Podman (recommended by the task):
```bash
podman run --rm -p 3000:3000 -p 4000:4000 \
  --name next-express-ejs-crud next-express-ejs-crud
```

After the container starts:
- Next.js UI: http://localhost:3000
- Express EJS pages: http://localhost:4000

Notes
- The container uses node:20-alpine and runs both processes via a tiny Node starter. In production you would typically split services or use a proper init/supervisor.
- The Next.js server uses next start on port 3000 and relies on next.config.js rewrites to reach the API at port 4000 inside the same container.
- If you deploy the apps separately, update web/next.config.js to point to the correct API origin, and set NEXT_ORIGIN to the external URL of the Next app so SSR fetches work.

Happy hacking!

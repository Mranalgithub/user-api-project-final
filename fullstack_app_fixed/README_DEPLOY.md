# Full-Stack Node.js App (Render + Vercel)

## Backend (Render)
- Primary URL: <your Render URL>
- Env vars to set in **Render → Environment**:
  - `MONGO_URI` (Atlas connection string, use db name **MyDB** exactly)
  - `SESSION_SECRET` (any strong random string)
  - `CLIENT_ORIGIN` (your Vercel URL, e.g. https://your-app.vercel.app)
  - `PORT` (Render sets this automatically; no need to define)

## Frontend (Vercel)
- Root Directory: `frontend`
- Framework Preset: **Other**
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL` = your Render backend URL (e.g. https://full-stack-node-js-application.onrender.com)

## Local Dev
Backend:
```bash
cd backend
cp .env.example .env
# fill in values, keeping database name case-sensitive: MyDB
npm install
npm run dev
```

Frontend:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Endpoints
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `POST /api/auth/logout`
- `GET  /api/user` (requires auth)
- `POST /api/upload` (form-data: file) (requires auth)
- `GET  /api/files` (requires auth)
- `GET  /health`
- `GET  /` → simple health page to avoid 404 confusion

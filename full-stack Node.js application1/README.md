# Full-stack React + Express (Passport + Multer + MongoDB)

Two apps:
- `backend/` → Express + MongoDB + Passport session auth + Multer (local uploads)
- `frontend/` → React (Vite) + Tailwind

## Run locally
### Backend
```
cp backend/.env.example backend/.env
# Fill MONGO_URI, SESSION_SECRET, CLIENT_ORIGIN=http://localhost:5173
cd backend && npm install
npm run dev
```
### Frontend
```
cp frontend/.env.example frontend/.env
# Ensure VITE_API_URL=http://localhost:5000
cd frontend && npm install
npm run dev
```
Open http://localhost:5173

## Deploy
### Backend → Render
- Create new Web Service from `backend/` repo
- `render.yaml` included
- Set env: `MONGO_URI`, `SESSION_SECRET`, `CLIENT_ORIGIN` (your Vercel URL)
- If using HTTPS in production, also set `NODE_ENV=production`

### Frontend → Vercel
- Import `frontend/` repo
- Set env: `VITE_API_URL=https://<your-render-service>.onrender.com`
- Build command: `npm run build`, Output dir: `dist`


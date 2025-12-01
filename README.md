# Mini Team Chat 

**Contains-**
- Real-time messaging (Socket.io)
- Channels
- JWT authentication
- Presence (online/offline)
- Message history + pagination

**What's included**
- `backend/` — Express + Socket.io + MongoDB models & routes
- `frontend/` — React (Vite) client with Socket.io client
- `.env.sample` files with required env vars

**How to run (local)**

1. Start MongoDB (or use Atlas). Set `MONGO_URI` in `backend/.env`.
2. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open the frontend URL printed by Vite (usually http://localhost:5173)

This scaffold is intentionally minimal so you can expand features (typing indicator, private channels, message editing).

#!/bin/bash
export PYTHONPATH=/app/back-end

# Lancer le backend (FastAPI)
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Lancer le frontend (Next.js)
cd /app/front-end
npm start

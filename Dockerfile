# ========================
# 1️⃣ Build FRONTEND (Next.js)
# ========================
FROM node:20-alpine AS frontend-build
WORKDIR /app/front-end

# Installer les dépendances et builder le front
COPY front-end/package*.json ./
RUN npm install
COPY front-end ./
RUN npm run build
RUN npx prisma generate

# ========================
# 2️⃣ Build BACKEND (FastAPI)
# ========================
FROM python:3.11-slim AS backend
WORKDIR /app/back-end
COPY back-end/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY back-end ./

# ========================
# 3️⃣ Final image
# ========================
FROM python:3.11-slim
WORKDIR /app

# --- Installer Node.js & npm ---
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --- Copier les fichiers du backend ---
COPY --from=backend /app/back-end ./back-end

# --- Copier le frontend buildé ---
COPY --from=frontend-build /app/front-end ./front-end

# --- Définir le chemin Python ---
ENV PYTHONPATH=/app/back-end

# --- Script de démarrage ---
COPY docker/start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000 8000
CMD ["./start.sh"]

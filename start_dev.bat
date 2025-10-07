@echo off
title MoleCode ATS - Dev Mode
echo 🚀 Démarrage du projet MoleCode ATS...

REM === Chemins relatifs (à adapter si besoin) ===
set FRONT_DIR=front-end
set BACK_DIR=back-end

REM === Lancer le backend Python ===
echo.
echo 🧠 Lancement du backend FastAPI...
cd %BACK_DIR%
start cmd /k "uvicorn main:app --reload"
cd ..

REM === Lancer le frontend Next.js ===
echo.
echo 💻 Lancement du frontend Next.js...
cd %FRONT_DIR%
if exist node_modules (
    echo Dépendances déjà installées.
) else (
    echo Installation des dépendances npm...
    npm install
)
start cmd /k "npm run dev"
cd ..

echo.
echo ✅ Tout est lancé !
echo 🌐 Frontend : http://localhost:3000
echo ⚙️  Backend : http://localhost:8000
pause

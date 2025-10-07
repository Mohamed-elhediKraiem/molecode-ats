# MoleCode ATS - Backend Scraper

Ce dossier contient le backend Python utilisé par MoleCode pour le scraping d’offres d’emploi depuis différentes plateformes (Indeed, Welcome To The Jungle, etc.).

### Installation des dépendances

Avant de lancer le serveur, installe les dépendances avec la commande suivante :

pip install -r requirements.txt


### Lancer le serveur

Pour démarrer l’API FastAPI localement :

python -m uvicorn main:app --reload


Le serveur sera accessible à l’adresse suivante :
[http://localhost:8000](http://localhost:8000)

### Fonctionnement

- L’API reçoit une **URL d’offre d’emploi** et retourne les informations suivantes au format JSON :
  - **Titre du poste**
  - **Nom de l’entreprise**
  - **Description complète du poste** (incluant le profil recherché)
- Aucune donnée n’est stockée : le backend agit comme un **scraper à la volée**.

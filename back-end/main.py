from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from scraping.wttj import scrape_wttj
from scraping.linkedin import scrape_linkedin
from scraping.cadremploi import scrape_cadremploi


app = FastAPI(title="MoleCode ATS Scraper", version="1.4")

# ✅ Autoriser les requêtes depuis ton frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # autorise GET, POST, etc.
    allow_headers=["*"],  # autorise tous les headers
)

@app.get("/")
def root():
    return {"message": "Bienvenue sur le scraper MoleCode 🔍"}

@app.get("/scrape")
def scrape_job(url: str = Query(..., description="URL de l'offre d'emploi")):
    url = url.lower()
    try:
        if "wttj" in url or "welcometothejungle" in url:
            data = scrape_wttj(url)
        elif "linkedin" in url:
            data = scrape_linkedin(url)
        # elif "cadremploi" in url:
        #     data = scrape_cadremploi(url)
        else:
            return {"error": "Source non prise en charge"}
        
        return data
    except Exception as e:
        return {"error": str(e)}

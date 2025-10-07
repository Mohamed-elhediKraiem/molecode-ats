from fastapi import FastAPI, Query
from scraping.indeed import scrape_indeed
from scraping.wttj import scrape_wttj
from scraping.linkedin import scrape_linkedin

app = FastAPI(title="MoleCode ATS Scraper", version="1.4")

@app.get("/")
def root():
    return {"message": "Bienvenue sur le scraper MoleCode 🔍"}

@app.get("/scrape")
def scrape_job(url: str = Query(..., description="URL de l'offre d'emploi")):
    url = url.lower()
    try:
        if "indeed" in url:
            data = scrape_indeed(url)
        elif "wttj" in url or "welcometothejungle" in url:
            data = scrape_wttj(url)
        elif "linkedin" in url:
            data = scrape_linkedin(url)
        else:
            return {"error": "Source non prise en charge"}
        return data
    except Exception as e:
        return {"error": str(e)}

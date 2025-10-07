import requests
from bs4 import BeautifulSoup
import re
import urllib.parse

def clean_text(text):
    return re.sub(r"\s+", " ", text.strip()) if text else ""

def scrape_google_jobs_from_url(job_url: str):
    """Cherche une offre sur Google Jobs via son URL (Indeed, WTTJ...) et retourne ses infos principales."""

    # Étape 1 : construire la requête Google
    q = urllib.parse.quote_plus(job_url)
    google_url = f"https://www.google.com/search?q={q}"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "fr-FR,fr;q=0.9"
    }

    # Étape 2 : récupérer la page Google
    response = requests.get(google_url, headers=headers, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    # Étape 3 : trouver le bloc "Google Jobs"
    # (il est dans une section <div> contenant "Emplois" ou "Jobs")
    jobs_section = soup.find("div", string=re.compile(r"Emplois|Jobs"))
    if not jobs_section:
        return {"error": "Offre non trouvée sur Google Jobs"}

    # Étape 4 : chercher le premier lien vers la fiche complète
    link_tag = soup.find("a", href=re.compile(r"/search\?q=.*?emplois|jobs"))
    if not link_tag:
        return {"error": "Impossible de trouver la fiche Google Jobs"}

    job_google_link = "https://www.google.com" + link_tag["href"]

    # Étape 5 : charger la fiche Google Jobs
    r = requests.get(job_google_link, headers=headers, timeout=10)
    r.raise_for_status()
    job_soup = BeautifulSoup(r.text, "html.parser")

    # Extraction titre, entreprise, description
    title = job_soup.find("h2")
    company = job_soup.find("span", string=re.compile("Entreprise|Company"))
    desc = job_soup.find("div", string=re.compile("Description"))

    return {
        "title": clean_text(title.get_text()) if title else None,
        "company": clean_text(company.get_text()) if company else None,
        "description": clean_text(desc.get_text()) if desc else None,
        "source": "Google Jobs",
        "url": job_google_link
    }

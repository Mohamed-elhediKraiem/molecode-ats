import requests
from bs4 import BeautifulSoup
import re

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text.strip())
    return text

def scrape_wttj(url: str):
    """Scrape une offre Welcome To The Jungle"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/125.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Erreur réseau : {e}"}

    soup = BeautifulSoup(response.text, "html.parser")

    # ---------- Titre du poste ----------
    title_tag = soup.find("h2")
    title = clean_text(title_tag.get_text()) if title_tag else None

    # ---------- Nom de l’entreprise ----------
    company_span = soup.select_one("a div span[class*='wui-text']")
    company = clean_text(company_span.get_text()) if company_span else None

    # ---------- Description ----------
    desc_tag = soup.find("div", {"data-testid": "job-section-description"})
    description = desc_tag.get_text("\n", strip=True) if desc_tag else None

    # ---------- Profil recherché ----------
    profile_tag = soup.find("div", {"data-testid": "job-section-experience"})
    profile = clean_text(profile_tag.get_text("\n", strip=True)) if profile_tag else ""

    # Fusionner description + profil dans un seul champ
    full_description = description
    if profile:
        full_description += "\n\nProfil recherché :\n" + profile
    
    if not title and not description:
        return {"error": "Impossible de détecter les informations sur la page"}

    return {
        "title": title,
        "company": company,
        "description": full_description.strip(),
        "source": "Welcome To The Jungle",
        "url": url
    }

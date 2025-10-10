import requests
from bs4 import BeautifulSoup
import re

def clean_text(text: str) -> str:
    """Nettoie le texte pour enlever les espaces inutiles."""
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text.strip())
    return text


def scrape_linkedin(url: str):
    """
    Scrape une offre LinkedIn pour extraire :
    - titre du poste
    - entreprise
    - description du poste (si disponible)
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/125.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Erreur réseau : {e}"}

    soup = BeautifulSoup(response.text, "html.parser")

    # ---------------------
    # 🔹 Nom de l’entreprise
    # ---------------------
    company_tag = None
    for a in soup.find_all("a", href=True):
        if "/company/" in a["href"]:
            company_tag = a
            break

    company = clean_text(company_tag.get_text()) if company_tag else None
    company_url = company_tag["href"] if company_tag else None

    # ---------------------
    # 🔹 Titre du poste (robuste)
    # ---------------------
    title = None

    # 1️⃣ Recherche explicite d’un <p>, <h1> ou <h2> contenant un titre pertinent
    title_candidates = soup.find_all(["h1", "h2", "p"], string=True)

    for t in title_candidates:
        text = clean_text(t.get_text())
        # Filtrer les éléments non pertinents
        if len(text) > 3 and not any(x in text.lower() for x in [
            "il y a", "candidature", "promu", "linkedin", "recruteur"
        ]):
            # Heuristique : mots fréquents dans un intitulé de poste
            if re.search(r"(h/f|engineer|développeur|developer|expert|manager|analyst|consultant|chef|lead|senior|architect)", text, re.IGNORECASE):
                title = text
                break

    # 2️⃣ Fallback : meta og:title (ex: <meta property="og:title" content="EXPERT POWER BI (H/F)">)
    if not title:
        meta_title = soup.find("meta", property="og:title")
        if meta_title and meta_title.get("content"):
            title = clean_text(meta_title["content"])

    # ---------------------
    # 🔹 Description du poste
    # ---------------------
    desc_tag = soup.find("section", {"class": re.compile("show-more-less-html__markup|description")})
    if not desc_tag:
        desc_tag = soup.find("div", {"class": re.compile("description|show-more")})
    description = clean_text(desc_tag.get_text(separator="\n")) if desc_tag else None

    # ---------------------
    # 🔹 Validation
    # ---------------------
    if not company and not title:
        return {"error": "Impossible de détecter les informations sur la page"}

    return {
        "title": title,
        "company": company,
        "company_url": company_url,
        "description": description,
        "source": "LinkedIn",
        "url": url
    }

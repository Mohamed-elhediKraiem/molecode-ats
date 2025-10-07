import requests
from bs4 import BeautifulSoup
import re

def clean_text(text: str) -> str:
    """Nettoie le texte pour supprimer les espaces multiples."""
    if not text:
        return ""
    return re.sub(r"\s+", " ", text.strip())

def scrape_cadremploi(url: str):
    """Scrape une offre Cadremploi (missions + profil)."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "fr-FR,fr;q=0.9",
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Erreur réseau : {e}"}

    soup = BeautifulSoup(response.text, "html.parser")

    # ---------- Titre ----------
    title_tag = soup.find("h1")
    title = clean_text(title_tag.get_text()) if title_tag else None

    # ---------- Entreprise ----------
    company_tag = soup.find("p", string=re.compile("ASTEK", re.IGNORECASE))
    company = "ASTEK"
    if not company_tag:
        # fallback: parfois le nom est dans une meta
        meta_company = soup.find("meta", {"property": "og:site_name"})
        if meta_company:
            company = clean_text(meta_company.get("content"))

    # ---------- Missions ----------
    missions_block = soup.find("div", {"id": "job-description"})
    missions_text = ""
    if missions_block:
        text_parts = missions_block.find_all(["p", "li"])
        missions_text = "\n".join(clean_text(t.get_text()) for t in text_parts if t.get_text().strip())

    # ---------- Profil ----------
    profile_block = soup.find("div", {"id": "job-profile"})
    profile_text = ""
    if profile_block:
        text_parts = profile_block.find_all(["p", "li"])
        profile_text = "\n".join(clean_text(t.get_text()) for t in text_parts if t.get_text().strip())

    # ---------- Fusion ----------
    description = ""
    if missions_text:
        description += "### Quelles sont les missions ?\n" + missions_text + "\n\n"
    if profile_text:
        description += "### Quel est le profil idéal ?\n" + profile_text

    if not description.strip():
        return {"error": "Impossible de trouver la description sur la page."}

    return {
        "title": title,
        "company": company,
        "description": description.strip(),
        "source": "Cadremploi",
        "url": url,
    }

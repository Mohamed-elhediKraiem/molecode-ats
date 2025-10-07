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
    # Priorité : lien vers /company/
    for a in soup.find_all("a", href=True):
        if "/company/" in a["href"]:
            company_tag = a
            break

    company = clean_text(company_tag.get_text()) if company_tag else None
    company_url = company_tag["href"] if company_tag else None

    # ---------------------
    # 🔹 Titre du poste
    # ---------------------
    # Recherche du <p> contenant le titre (souvent visible dans une <p> juste après la div entreprise)
    title_tag = soup.find("p", string=re.compile(r".+"))
    title = clean_text(title_tag.get_text()) if title_tag else None

    # Par sécurité : fallback sur meta title
    if not title:
        meta_title = soup.find("meta", property="og:title")
        if meta_title and meta_title.get("content"):
            title = clean_text(meta_title["content"])

    # ---------------------
    # 🔹 Description du poste
    # ---------------------
    # LinkedIn masque souvent le contenu complet, mais on peut récupérer le bloc <section> s’il est présent
    desc_tag = soup.find("section", {"class": re.compile("show-more-less-html__markup|description")})
    if not desc_tag:
        # Certains templates utilisent des div textuelles
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

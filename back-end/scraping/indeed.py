import requests
from selectolax.parser import HTMLParser
from bs4 import BeautifulSoup
import re

def clean_text(text: str) -> str:
    """Nettoie le texte (supprime les espaces et balises inutiles)."""
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text.strip())
    return text

def scrape_indeed(url: str):
    """Scrape une offre Indeed et retourne un JSON minimal propre."""
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

    tree = HTMLParser(response.text)

    # Extraction du titre
    title_node = tree.css_first("h1")
    title = clean_text(title_node.text()) if title_node else None

    # Nom de l'entreprise
    company_node = tree.css_first(".jobsearch-InlineCompanyRating div")
    company = clean_text(company_node.text()) if company_node else None

    # Description
    desc_el = tree.css_first("#jobDescriptionText")
    if desc_el:
        raw_html = desc_el.html
        soup = BeautifulSoup(raw_html, "html.parser")
        description = clean_text(soup.get_text(separator="\n"))
    else:
        description = None

    if not title and not description:
        return {"error": "Impossible de détecter les informations sur la page"}

    return {
        "title": title,
        "company": company,
        "description": description,
        "source": "Indeed",
        "url": url
    }

import requests
from selectolax.parser import HTMLParser
from models.job import Job

def scrape_indeed(url: str):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "fr-FR,fr;q=0.9",
        "Referer": "https://www.google.com/",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1",
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Erreur réseau : {e}"}

    tree = HTMLParser(response.text)
    title = company = description = None

    # Extraction du titre
    title_node = tree.css_first("h1")
    if title_node:
        title = title_node.text(strip=True)

    company_node = tree.css_first(".jobsearch-InlineCompanyRating div")
    if company_node:
        company = company_node.text(strip=True)

    desc_el = tree.css_first("#jobDescriptionText")
    if desc_el:
        description = desc_el.text(separator="\n").strip()

    return {
        "title": title,
        "company": company,
        "description": description,
        "source": "Indeed",
        "url": url
    }

import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("title").text().trim();
    const society =
      $('meta[property="og:site_name"]').attr("content") ||
      new URL(url).hostname.replace(/^www\./, "").split(".")[0];

    return NextResponse.json({ title, society });
  } catch (error) {
    return NextResponse.json({ error: "Scrape failed" }, { status: 500 });
  }
}

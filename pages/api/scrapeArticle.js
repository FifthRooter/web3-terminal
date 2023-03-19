// pages/api/scrapeArticle.js
import scrapeDecryptArticle from "../../scraper/scrapers/decrypt";
import scrapeCoindesktArticle from "../../scraper/scrapers/coindesk";

export default async function handler(req, res) {
  const { url } = req.query;

  console.log(`scrapeArticle url: ${url}`);
  if (!url) {
    res.status(400).json({ message: "URL is required" });
    return;
  }

  try {
    console.log("calling scrapeDecryptArticle...");
    const content = await scrapeDecryptArticle(url);
    res.status(200).json({ content });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while scraping the article" });
  }
}

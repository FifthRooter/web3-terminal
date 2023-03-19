// pages/api/scrapeArticle.js
import scrapeDecryptArticle from "../../../scraper/scrapers/decrypt";
import scrapeCoindeskArticle from "../../../scraper/scrapers/coindesk";

export default async function handler(req, res) {
  const { url } = req.query;

  console.log(`scrapeArticle url: ${url}`);
  if (!url) {
    res.status(400).json({ message: "URL is required" });
    return;
  }

  try {
    const hostname = new URL(url).hostname;
    let content;

    if (hostname === "decrypt.co") {
      console.log("calling scrapeDecryptArticle...");
      content = await scrapeDecryptArticle(url);
    } else if (hostname === "www.coindesk.com") {
      console.log("calling scrapeCoindeskArticle...");
      content = await scrapeCoindeskArticle(url);
    } else {
      res.status(400).json({ message: "Unsupported URL" });
      return;
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while scraping the article" });
  }
}

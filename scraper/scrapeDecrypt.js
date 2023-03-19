const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const baseURL = "https://decrypt.co";

async function scrapeDecrypt() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${baseURL}/news`, { waitUntil: "networkidle2" });

    const articles = await page.$$eval(
      "div.sc-50880c4b-1.kiBHZa.border-b.md\\:border-r.border-decryptGridline > a",
      (elements, baseURL) =>
        elements.map((element) => {
          const title = element.querySelector("h2").innerText.trim();
          const link = baseURL + element.getAttribute("href");
          return {
            title,
            link,
          };
        }),
      baseURL // Pass baseURL as an argument
    );

    // Save the articles to news.json
    // const newsFilePath = path.join(__dirname, "news.json");
    // fs.writeFileSync(newsFilePath, JSON.stringify(articles, null, 2));

    await browser.close();
    console.log(`Decrypt articles: ${articles}`);

    return articles;
  } catch (error) {
    console.error("Error fetching page:", error);
  }
}

module.exports = {
  async startDecryptScraper() {
    console.log("Starting Decrypt scraper...");
    return await scrapeDecrypt();
  },
};

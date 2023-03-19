// scraper/scrapers/decrypt.js

const puppeteer = require("puppeteer");

export default async function scrapeDecryptArticle(url) {
  console.log("scrapeDecryptArticle called! Scraping...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const paragraphs = await page.$$eval(
    "div.grow.xl\\:px-5.xl\\:mx-\\[4\\.375rem\\] > div > div.flex.flex-row.relative > div > div > p",
    (elements) =>
      elements.map((element) => ({
        text: element.innerText,
        href: element.querySelector("a")?.href || null,
      }))
  );
  await browser.close();
  return paragraphs;
}

const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeArticle(url) {
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

const url =
  "https://decrypt.co/123749/fdic-demands-buyer-signature-bank-give-up-crypto-reuters";

scrapeArticle(url)
  .then((articleContent) => {
    console.log(articleContent);
    fs.writeFileSync("article.txt", JSON.stringify(articleContent, null, 2));
  })
  .catch((error) => {
    console.error("Error scraping article content:", error);
  });

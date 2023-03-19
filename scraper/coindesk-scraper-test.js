const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeArticle(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for the content container to load
  await page.waitForSelector(
    ".typography__StyledTypography-owin6q-0.bYmaON.at-text"
  );

  // Search for all <p> tags within the specified container
  const paragraphs = await page.$$eval(
    ".typography__StyledTypography-owin6q-0.bYmaON.at-text p",
    (elements) =>
      elements.map((element) => ({
        text: element.innerText,
      }))
  );

  await browser.close();
  return paragraphs;
}

const url =
  "https://www.coindesk.com/consensus-magazine/2023/03/17/animoca-brands-co-founder-royalties-make-it-possible-for-nft-projects-to-flourish/";

scrapeArticle(url)
  .then((articleContent) => {
    console.log(articleContent);
    fs.writeFileSync(
      "coindesk-article.txt",
      JSON.stringify(articleContent, null, 2)
    );
  })
  .catch((error) => {
    console.error("Error scraping article content:", error);
  });

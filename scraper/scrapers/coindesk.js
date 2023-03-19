const puppeteer = require("puppeteer");

async function scrapeCoindeskArticle(url) {
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

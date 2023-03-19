const { startCoindeskScraper } = require("./scrapeCoindesk");
const { startDecryptScraper } = require("./scrapeDecrypt");
const fs = require("fs");
const path = require("path");

async function runScrapers() {
  try {
    const decryptArticles = await startDecryptScraper();

    const coindeskArticles = await startCoindeskScraper();
    return { coindeskArticles, decryptArticles };
  } catch (error) {
    console.error(error);
    return {};
  }
}

// ... previous part of the code

async function start() {
  const { coindeskArticles, decryptArticles } = await runScrapers();
  const allArticles = [...coindeskArticles, ...decryptArticles];

  const newsFilePath = path.join(process.cwd(), "public", "news.json");
  const blacklistFilePath = path.join(
    process.cwd(),
    "public",
    "blacklist.json"
  );

  const fileContents = fs.readFileSync(newsFilePath, "utf8");
  const blacklistContents = fs.readFileSync(blacklistFilePath, "utf8");
  const existingArticles = JSON.parse(fileContents);
  const blacklist = JSON.parse(blacklistContents);

  const newArticles = allArticles.filter((article) => {
    return (
      !existingArticles.some(
        (existingArticle) => existingArticle.title === article.title
      ) &&
      !blacklist.some(
        (blacklistedArticle) => blacklistedArticle.title === article.title
      )
    );
  });

  if (newArticles.length > 0) {
    const updatedArticles = [...existingArticles, ...newArticles];
    fs.writeFileSync(newsFilePath, JSON.stringify(updatedArticles, null, 2));
  }

  console.log(`Scraped ${newArticles.length} new articles`);
  // setTimeout(start, 30 * 60 * 1000); // run every 30 minutes
}

start();

module.exports = { start };

const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeCoindesk() {
  const url = "https://www.coindesk.com/web3/";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const articleCards = $(
    ".featured-leaderboardstyles__ArticlesListWrapper-sc-15oqi80-2 .article-cardstyles__StyledWrapper-q1x8lc-0"
  );

  const articles = [];

  articleCards.each((index, element) => {
    const titleElement = $(element).find(".card-title");
    const title = titleElement.text();
    const link = `https://www.coindesk.com${titleElement.attr("href")}`;

    articles.push({
      title,
      link,
    });
  });

  // Save the articles to news.json
  //   const newsFilePath = path.join(__dirname, "news.json");
  //   fs.writeFileSync(newsFilePath, JSON.stringify(articles, null, 2));
  return articles;
}

// scrapeCoindesk().then((articles) => {
//   console.log("Articles fetched:", articles);
// });

module.exports = {
  async startCoindeskScraper() {
    console.log("Starting Coindesk scraper...");
    return await scrapeCoindesk();
  },
};

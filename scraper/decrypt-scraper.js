const puppeteer = require("puppeteer");
const fs = require("fs");

const baseURL = "https://decrypt.co";

async function scrapeNewsTitles() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${baseURL}/news`, { waitUntil: "networkidle2" });

    const content = await page.content();

    // Write response data to a file
    fs.writeFile("response.html", content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File saved successfully.");
      }
    });

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

    console.log(articles);

    await browser.close();
  } catch (error) {
    console.error("Error fetching page:", error);
  }
}

scrapeNewsTitles();

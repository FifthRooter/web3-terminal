import fs from "fs";
import path from "path";

const newsFilePath = path.join(process.cwd(), "news.json");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, headline } = req.body;

      const newsData = JSON.parse(fs.readFileSync(newsFilePath, "utf8"));

      const newsItem = {
        id: newsData.length + 1,
        title,
        headline,
      };

      newsData.push(newsItem);
      fs.writeFileSync(newsFilePath, JSON.stringify(newsData, null, 2));

      res.status(200).json(newsItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

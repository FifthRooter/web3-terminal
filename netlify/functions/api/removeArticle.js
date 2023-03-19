import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const filePath = path.join(process.cwd(), "public", "news.json");
    const blacklistPath = path.join(process.cwd(), "public", "blacklist.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const blacklistContents = fs.readFileSync(blacklistPath, "utf8");
    const data = JSON.parse(fileContents);
    const blacklist = JSON.parse(blacklistContents);

    const removedArticleIndex = data.findIndex(
      (article) => article.title === req.body.title
    );

    if (removedArticleIndex !== -1) {
      data.splice(removedArticleIndex, 1);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    if (!blacklist.some((article) => article.title === req.body.title)) {
      blacklist.push(req.body);
      fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 2));
    }

    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
}

import fs from "fs";
import path from "path";

const { start } = require("../../../scraper/scraper");
start();

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "public", "news.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  res.status(200).json(data);
}

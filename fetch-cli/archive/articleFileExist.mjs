import { existsSync } from "fs";
import { parseArticleDir } from "./parseArticleDir.mjs";

export function articleFileExist(article) {
  const targetFile = parseArticleDir(`${article.number}.article.ts`);
  return existsSync(targetFile);
}

import { existsSync } from "fs";
import { join } from "path";
import { parseArticleDir } from "./parseArticleDir.mjs";

export function articleMediaFilesDownloaded(article) {
  const folder = parseArticleDir(`media/${article.number}`);
  if (!existsSync(folder)) return false;

  const textFile = join(folder, `${article.number}.txt`);
  const audioFile = join(folder, `audio-${article.number}.mp3`);
  const coverFilePng = join(folder, `img-${article.number}.png`);
  const coverFileJpg = join(folder, `img-${article.number}.jpg`);
  if (!existsSync(textFile)) return false;
  if (!existsSync(audioFile)) return false;
  if (!existsSync(coverFileJpg) && !existsSync(coverFilePng)) return false;
  return true;
}

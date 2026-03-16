import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { articleInfoToString } from "./articleInfo";
import { ArticleProto } from "./parseContent";

function ensure(folder: string) {
  if (existsSync(folder)) return;
  mkdirSync(folder, { recursive: true });
}
export function transform() {
  const articleFolder = resolve(__dirname, "./article");
  const resultFolder = resolve(__dirname, "./article/media");
  ensure(resultFolder);
  const files = readdirSync(articleFolder);

  const requireModule = (filename: string) =>
    require(resolve(articleFolder, filename)).info as ArticleProto;
  // console.log(files)
  for (const f of files) {
    if (!f.endsWith(".article.ts")) continue;

    const name = f.slice(0, f.indexOf("."));
    // console.log(name)

    const info = requireModule(f);
    const mediaFolder = resultFolder + `/${name}/`;
    ensure(mediaFolder);
    const outputFile = resolve(mediaFolder, name + ".txt");
    const content = articleInfoToString(info);
    writeFileSync(outputFile, content);
  }
}

// transform()

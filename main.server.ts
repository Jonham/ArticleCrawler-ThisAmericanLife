import * as Hapi from "@hapi/hapi";
import { mkdirSync, writeFileSync } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import { ArticleProto } from "./parseContent";
import { fetchMedia } from "./fetchMedia";
import { cropImage } from "./cropImage";
import { transform } from "./transform";

const init = async () => {
  const server = Hapi.server({
    port: 3030,
    host: "0.0.0.0",
  });

  await server.register(require("@hapi/inert"));
  // Doc: https://hapi.dev/tutorials/servingfiles/?lang=en_US
  server.route({
    method: "GET",
    path: "/crop-cover/{param*}",
    handler: {
      directory: {
        path: resolve(__dirname, "static/crop-cover"),
        index: ["index.html"],
        listing: true,
      },
    },
  });

  server.route({
    method: "POST",
    path: "/new-article",
    config: { cors: true },
    handler: async (req, h) => {
      let data: ArticleProto | string = h.request.payload;
      if (typeof data !== "object") {
        data = JSON.parse(data) as ArticleProto;
      }

      await saveFile(data);
      const msg = `${data.number} - ${data.title} DONE`;
      console.log(msg);
      transform();
      return "ok";
    },
  });
  await server.start();
  console.log("server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();

async function saveFile(data: ArticleProto) {
  const number = data.number;
  console.log("> saving article", number);

  if (!data.coverURL || !data.audioURL) {
    console.log(data);
  }
  if (!data.coverURL) console.error("data.coverURL is null");
  if (!data.audioURL) console.error("data.audioURL is null");

  const articleContent = `import { ArticleProto } from '../parseContent'
export const info: ArticleProto =${JSON.stringify(data, null, "  ")}`;

  const filename = resolve(__dirname, `./article/${number}.article.ts`);
  writeFileSync(filename, articleContent);

  // 下载内容
  const mediaFolder = resolve(__dirname, `./article/media/${number}/`);
  mkdirSync(mediaFolder, { recursive: true });

  if (data.audioURL) {
    console.log("> start fetching audio:", data.audioURL);
    await fetchMedia(
      data.audioURL,
      number,
      mediaFolder,
      `fetch audio: ${data.number}`
    );
  }

  if (data.coverURL) {
    console.log("-> start fetching cover:", data.coverURL);
    const targetFilePath = await fetchMedia(
      data.coverURL,
      number,
      mediaFolder,
      `fetch cover: ${data.number}`
    );
    const sqrImg = join(
      dirname(targetFilePath),
      basename(targetFilePath) + "_sqr" + extname(targetFilePath)
    );
    console.log("sqrImg", sqrImg);

    await cropImage(targetFilePath, sqrImg);
    console.log("cropImage DONE");
  }
}

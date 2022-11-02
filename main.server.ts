import * as Hapi from "@hapi/hapi";
import { createWriteStream, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { ArticleProto } from "./parseContent";
import axios from "axios";
import path = require("path");
import * as Notify from "node-notifier";
import { transform } from "./transform";
import ProgressBar from 'progress'

const init = async () => {
  const server = Hapi.server({
    port: 3030,
    host: "0.0.0.0",
  });

  await server.register(require('@hapi/inert'));
  // Doc: https://hapi.dev/tutorials/servingfiles/?lang=en_US
  server.route({
    method: 'GET',
    path: '/crop-cover/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, "static/crop-cover"),
        index: ['index.html'],
        listing: true,
      }
    }
  })

  server.route({
    method: "POST",
    path: "/new-article",
    config: {
      cors: true,
    },
    handler: async (req, h) => {
      let data: ArticleProto | string = h.request.payload;
      if (typeof data !== "object") {
        data = JSON.parse(data) as ArticleProto;
      }

      // console.log(data)
      await saveFile(data);
      const msg = `${data.number} - ${data.title} DONE`;
      Notify.notify(msg);
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
  console.log("saving article", number);

  const articleContent = `import { ArticleProto } from '../parseContent'

export const info: ArticleProto =${JSON.stringify(data, null, "  ")}`;

  const filename = resolve(__dirname, `./article/${number}.article.ts`);
  writeFileSync(filename, articleContent);

  // 下载内容
  const mediaFolder = resolve(__dirname, `./article/media/${number}/`);
  mkdirSync(mediaFolder, { recursive: true });

  if (data.coverURL) {
    console.log('> start fetching cover')
    await fetchMedia(data.coverURL, number, mediaFolder, `fetch cover: ${data.number}`);
  }
  if (data.audioURL) {
    console.log('> start fetching audio:', data.audioURL)
    await fetchMedia(data.audioURL, number, mediaFolder, `fetch audio: ${data.number}`);
  }
}

async function fetchMedia(link: string, number: number, mediaFolder: string, hint: string = '') {
  const m = link.match(/\.(png|jpg|jpeg|gif|webp|mp3|mp4)/);
  let suffix = m ? m[0] : ".png";

  const responseType = "arraybuffer";
  const res = await axios.get(link, {
    responseType,
    onDownloadProgress: (ev) => {
      console.log('onDownloadProgress', ev)
    }
  });

  console.log(`audio-${number}${suffix}`, res.data.length);
  const mediaType = suffix === ".mp3" ? "audio" : "img";
  writeFileSync(`${mediaFolder}/${mediaType}-${number}${suffix}`, res.data);
}

async function fetchAudio(link: string, number: number, mediaFolder: string, hint: string = '') {
  const m = link.match(/\.(webp|mp3|mp4)/);
  let suffix = m ? m[0] : ".png";

  const responseType = "stream";
  const { data, headers } = await axios.get(link, {
    responseType,
  });
  const totalLength = headers['content-length']

  console.log('Starting download')
  const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(totalLength)
  })

  const mediaType = suffix === ".mp3" ? "audio" : "img";
  const writer = createWriteStream(
    `${mediaFolder}/${mediaType}-${number}${suffix}`
  )

  data.on('data', (chunk) => progressBar.tick(chunk.length))
  data.pipe(writer)
  // console.log(`audio-${number}${suffix}`, res.data.length);
  // const mediaType = suffix === ".mp3" ? "audio" : "img";
  // writeFileSync(`${mediaFolder}/${mediaType}-${number}${suffix}`, res.data);
}

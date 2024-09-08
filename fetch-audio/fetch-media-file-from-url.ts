// https://pfx.vpixl.com/6qj4J/dts.podtrac.com/redirect.mp3/chtbl.com/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/bbbcc290-ed3b-44a2-8e5d-5513e38cfe20/episodes/67ea2560-6f40-4c9a-bc11-61627cc915e7/audio/128/default.mp3?awCollectionId=bbbcc290-ed3b-44a2-8e5d-5513e38cfe20&awEpisodeId=67ea2560-6f40-4c9a-bc11-61627cc915e7

import { createWriteStream } from "fs";
import { basename } from "path";
import { $ } from "zx";

type FileDownloadStreamMeta = {
  url: string;
  fileSize: number;
  fileType: string;
  stream: ReadableStream;
};
const MAX_REDIRECT_COUNT = 20;

async function resolveRedirects(link: string) {
  const redirectLinks: string[] = [];
  let linkReady = false;
  let count = 0;
  let retryCount = 0;
  let url = link;
  while (!linkReady) {
    redirectLinks.push(link);
    const result = await fetch(url, {
      method: "GET",
      redirect: "manual",
    }).catch((err) => {
      console.log(`[${count}]`, err);
      console.log("redirectLinks:", redirectLinks);
    });
    if (!result) {
      console.log({ retryCount });
      retryCount++;
      count--;
      if (retryCount > 10)
        throw new Error(`retryCount exceed ${retryCount} times.`);
      continue;
    }

    retryCount = 0;
    const redirectLocation = result.headers.get("location");
    const contentType = result.headers.get("content-type");
    if (!redirectLocation) {
      if (!contentType) throw new Error("receive no contentType");

      const rawLength = result.headers.get("content-length");
      const fileSize = parseInt(rawLength) ? parseInt(rawLength) : 0;
      const stream = result.body;
      const fileType = contentType;
      const meta: FileDownloadStreamMeta = {
        url,
        stream,
        fileSize,
        fileType,
      };
      return meta;
    }
    url = redirectLocation;
    if (count > MAX_REDIRECT_COUNT)
      throw new Error(`Exceed max redirect count: ${MAX_REDIRECT_COUNT}`);
  }
}

export async function downloadMediaFile(
  link: string,
  targetFilePath: string,
  opt?: {
    onProgress?: (params: { progress: number; isDone?: boolean }) => void;
    onDone?: () => void;
    onLoadMetadata?: (params: {
      url: string;
      fileSize: number;
      fileType: string;
    }) => void;
  }
) {
  // wget

  const filename = basename(link);
  await $`wget ${link}`;
  await $`mv ${filename} ${targetFilePath}`;

  // const res = await resolveRedirects(link);
  // opt?.onLoadMetadata?.({
  //   url: res.url,
  //   fileSize: res.fileSize,
  //   fileType: res.fileType,
  // });

  // const reader = res.stream.getReader();
  // const wStream = createWriteStream(targetFilePath, {
  //   autoClose: false,
  // });

  // let loadedSize = 0;
  // while (true) {
  //   const chunk = await reader.read();
  //   const buffer = chunk.value as Uint8Array;
  //   loadedSize += buffer.byteLength;
  //   const isDone = loadedSize === res.fileSize;

  //   if (buffer) {
  //     const progress = (loadedSize / res.fileSize) * 100;
  //     opt?.onProgress?.({ progress, isDone });

  //     const { promise, resolve, reject } = createPromise();
  //     wStream.write(buffer, (err) => {
  //       if (err) {
  //         console.error(err);
  //         return reject(err);
  //       }
  //       resolve("");
  //     });

  //     await promise;
  //   }
  //   if (isDone) opt?.onDone?.();
  //   if (chunk.done || isDone) {
  //     break;
  //   }
  // }
  // wStream.close();
  console.log(`<- DONE ${basename(targetFilePath)}`);
}

function createPromise() {
  let resolve: (n: any) => void;
  let reject: (e: Error) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

import { join } from "path/posix";
import { downloadMediaFile } from "./fetch-audio/fetch-media-file-from-url";
import { throttleLogger, SECOND } from "./util/throttleLogger";

export async function fetchMedia(
  link: string,
  number: number,
  mediaFolder: string,
  hint: string = ""
) {
  const m = link.match(/\.(png|jpg|jpeg|gif|webp|mp3|mp4)/);
  let suffix = m ? m[0] : ".png";

  const mediaType = suffix === ".mp3" ? "audio" : "img";
  const fileName = `${mediaType}-${number}${suffix}`;
  const targetFilePath = join(mediaFolder, fileName);

  console.log(hint);
  let lastPercent = 0;
  const progressLogger = throttleLogger({
    timeout: 5 * SECOND,
  });

  await downloadMediaFile(link, targetFilePath, {
    onLoadMetadata: (meta) => {
      console.log(
        `Start downloading: ${targetFilePath}
-> (${meta.fileType} of size ${meta.fileSize})
-> from ${meta.url}`
      );
    },
    onProgress: (params) => {
      progressLogger(
        `Downloading ${fileName}:`,
        +params.progress.toFixed(2),
        "%"
      );
    },
    onDone: () => {
      console.log(`Download ${fileName} is finished.`);
    },
  });

  return targetFilePath;
}

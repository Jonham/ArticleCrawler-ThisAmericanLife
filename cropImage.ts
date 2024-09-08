import { $ } from "zx/core";

export async function cropImage(p: string, target: string) {
  $.verbose = false;

  const raw = await $`ffmpeg -i "${p}" 2>&1 | grep "Stream"`.catch((e) => {
    return e;
  });
  console.log("raw", raw);
  const [height, width] = raw.stdout.match(/(\d+)x(\d+)/)[0].split("x");

  const imgSize = Math.max(+height, +width);
  console.log({ imgSize, height, width });
  await $`ffmpeg -y -i ${p} \
    -vf "pad=w=${imgSize}:h=${imgSize}:x=-1:y=-1:color=black" \
    "${target}"`;
}

// async function mainTest() {
//   await cropImage(
//     "/Users/jonham/code/ArticleCrawler-ThisAmericanLife/article/media/837/img-837.png",
//     "/Users/jonham/code/ArticleCrawler-ThisAmericanLife/article/media/837/img-837.png_sqr.png"
//   );
// }

// mainTest();

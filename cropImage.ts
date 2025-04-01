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
async function main() {
  const args = process.argv.slice(2); // 去掉前两个默认参数

  if (args.length === 0) {
    console.log('No parameters provided.');
    return;
  }
  if (args.length !== 2) {
    console.log('2 params are required.');
    return;
  }
  const [fromPath, targetPath] = args
  await cropImage(fromPath, targetPath)
}
const inTsNode = process.argv[0].endsWith('/ts-node')
const runAsMain = require.main === module
if (inTsNode && runAsMain) {
  console.log('self-run in cropImage.ts')
  main()
}

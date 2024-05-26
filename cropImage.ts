import { exec } from "child_process";

export async function cropImage(p: string, target: string) {
  const cmd = `ffmpeg -y -i ${p} -vf "pad=aspect=1:x=-1:y=-1:color=black" ${target}`;
  return new Promise((resolve, reject) => {
    return exec(cmd, (err) => {
      if (err) return reject(err);
      return resolve("ok");
    });
  });
}

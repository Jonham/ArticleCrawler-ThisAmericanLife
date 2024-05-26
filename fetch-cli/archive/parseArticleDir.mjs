import { resolve } from "path";

/**
 * @param {string} dir
 * @returns {string}
 */
export function parseArticleDir(dir) {
  return resolve(import.meta.dirname, `../../article`, dir);
}

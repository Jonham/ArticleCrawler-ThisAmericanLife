#! env zx
$.verbose = false;

import { loadArchivePageData } from "./loadArchivePageData.mjs";
import { fetchDetailPageContent } from "./fetchDetailPageContent.mjs";
import { saveDataToServer } from "./saveDataToServer.mjs";
import { articleFileExist } from "./articleFileExist.mjs";
import { articleMediaFilesDownloaded } from "./articleMediaFilesDownloaded.mjs";
export const link = "https://www.thisamericanlife.org/archive";

const dataList = await loadArchivePageData();
const list = dataList.slice(0, 10);

let i = 0;
const logProgress = (i) => {
  console.clear();
  console.log("===========================");
  console.log(
    list
      .map(
        (article, index) =>
          `${index === i ? `⌛️` : article.isDone ? "✅" : "-"} ${
            article.index
          }. ${article.title}`
      )
      .join("\n")
  );
};

for (let i = 0; i < list.length; i++) {
  logProgress(i);
  const item = list[i];
  if (!item.index) {
    console.log(`index not found, skip`, item);
    continue;
  }
  const content = await fetch(item.link).then((res) => res.text());
  const article = await fetchDetailPageContent(content, item);

  if (articleFileExist(article) && articleMediaFilesDownloaded(article)) {
    console.log(article.number, "skip");
    item.isDone = true;
    continue;
  }
  if (!article) {
    console.error(`${item} article is empty`);
    continue;
  }
  await saveDataToServer(article);
  item.isDone = true;
}

logProgress(i);

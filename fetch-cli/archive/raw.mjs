#! env zx
import { load } from "cheerio";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";

const link = "https://www.thisamericanlife.org/archive";

const dataList = await loadArchivePageData();
const list = dataList.slice(0, 10);

for (let i = 0; i < list.length; i++) {
  const item = list[i];
  const content = await fetch(item.link).then((res) => res.text());
  const article = await fetchDetailPageContent(content, item);
  // console.log(article);
  // await writeToTsFile(article);
  if (articleFileExist(article)) {
    console.log(article.number, "skip");
    continue;
  }
  await callApi(article);
}

async function callApi(result) {
  // /new-article
  return fetch("http://0.0.0.0:3030/new-article", {
    body: JSON.stringify(result),
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
  });
}
function articleFileExist(article) {
  const targetFile = `../../article/${article.number}.article.ts`;
  return existsSync(targetFile);
}

async function writeToTsFile(article) {
  const targetFile = `../../article/${article.number}.article.ts`;
  if (existsSync(targetFile)) {
    console.log(`${targetFile} exists, skip`);
    return;
  }

  const data = `import { ArticleProto } from '../parseContent'

  export const info: ArticleProto = ${JSON.stringify(article, null, "  ")}`;
  await writeFile(targetFile, data);
}

function getItemFromList(l) {
  if (l.length > 1) return l[0];
  return l[0];
}
function getAttr(elem, name, defaultValue = "") {
  return elem.attributes.find((i) => i.name === name)?.value || defaultValue;
}

async function loadArchivePageData() {
  const content = await fetch(link).then((res) => res.text());

  const $ = load(content);

  const articleList = $("#main article");
  console.log("articleList.length", articleList.length);

  const dataList = [];
  articleList.map((i, el) => {
    const index = getAttr(el, "data-episode");
    const linkElem = getItemFromList($("a", el));
    if (!linkElem) {
      console.log(i);
    }

    const link = getAttr(linkElem, "href");
    const d = $(".date-display-single", el).text();
    const title = $("h2", el).text();
    const coverThumbnail = getAttr(getItemFromList($("img", el)), "src");
    const description = $(".content", el).text();
    const data = {
      index,
      link: `https://www.thisamericanlife.org${link}`,
      title,
      description,
      coverThumbnail,
      updateDate: d,
    };

    dataList.push(data);
  });
  await fs.writeJson("list.json", dataList);
  return dataList;
}

function fetchDetailPageContent(rawContent, rawMetadata) {
  const $ = load(rawContent.replaceAll("&nbsp;", " "));
  const title = $(".episode-title h1").text();
  const items = getItemFromList($(".field-type-text-with-summary p"));
  const brief = items.children[0].data.trim();
  const mainArticle = $("#main article.view-full")[0];

  const number = +getAttr(mainArticle, "data-episode");
  const script = $("#playlist-data").text().trim();
  const scriptData = JSON.parse(script);
  const coverElem = $(".tal-episode-image > img")[0];
  const coverURL = coverElem ? getAttr(coverElem, "src") : "";

  const audioURL = scriptData.audio;
  const preUpdateTime = $("#main .episode-header .date-display-single").text();
  const isUpdate = rawMetadata.updateDate !== preUpdateTime;

  const actList = [];
  $("#main .field-name-field-acts article").map((itemIndex, i) => {
    const title = $(".act-header a", i).text().trim();
    const brief = $(".field-type-text-with-summary p", i).text().trim();
    const author = $(".field-name-field-contributor a", i).text().trim();
    const index =
      $(".field-name-field-act-label .field-item", i)?.text()?.trim() || "";
    const song =
      $(".field-name-field-song .field-item", i)?.text()?.trim() || "";
    const act = {
      index,
      title,
      brief,
      author,
      timestamp: 0,
      song: !song
        ? []
        : [
            {
              raw: song,
              name: song.split("by")[0]?.trim() ?? "",
              singer: song.split("by")[1]?.trim() ?? "",
            },
          ],
    };
    actList.push(act);
  });

  const data = {
    number,
    title,
    brief,
    preUpdateTime: isUpdate ? preUpdateTime : "",
    isUpdate: isUpdate,
    updateTime: rawMetadata.updateDate,
    coverURL,
    audioURL,
    acts: actList,
  };

  return data;
}

import { load } from "cheerio";
import { resolve } from "path/posix";
import { link } from "./raw.mjs";
import { getAttr } from "./getAttr.mjs";
import { getItemFromList } from "./getItemFromList.mjs";

export async function loadArchivePageData() {
  const content = await fetch(link).then((res) => res.text());

  const $ = load(content);

  const articleList = $("#main article");
  console.log("articleList.length", articleList.length);

  /** @type {(import("./raw.d").ArticleItem)[]} */
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
  await fs.writeJson(
    resolve(__dirname, "../../article/media/", "list.json"),
    dataList
  );
  return dataList;
}

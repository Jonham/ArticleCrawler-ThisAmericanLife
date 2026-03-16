import { load } from "cheerio";
import { resolve } from "path/posix";
import { link } from "./raw.mjs";
import { getAttr } from "./getAttr.mjs";
import { getItemFromList } from "./getItemFromList.mjs";
import { writeFile } from "fs/promises";

async function fetchPage() {
  return fetch("https://www.thisamericanlife.org/archive", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,zh;q=0.8,es;q=0.7,it;q=0.6,la;q=0.5",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "priority": "u=0, i",
      "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\"",
      "sec-ch-ua-arch": "\"arm\"",
      "sec-ch-ua-bitness": "\"64\"",
      "sec-ch-ua-full-version": "\"144.0.7559.97\"",
      "sec-ch-ua-full-version-list": "\"Not(A:Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"144.0.7559.97\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "\"\"",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-ch-ua-platform-version": "\"26.3.0\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "cookieconsent_status=dismiss; cf_clearance=TrszGHuHdpnHfae7KpTvvkgMnKAhJoyIBlb9g2U.6bM-1771169475-1.2.1.1-Pv7C8j7mN.l.e8C_P7Gwaky_lKzDe4HSLBQXxUngZxD3DhLFvt90BqcXzWZqqsY0AhKhrO8Rt0kgTiiq05paSlpP1oqKk.iRN.d.5SzrhHHm6wtygqVv7O5qqFGte4tRCAMVqYckbzb5GtvIqf5VBxAu2p58Qq3yv8bwQhQj9xu_L5X7CNGRDF1zOKIZkDrAl5KeH.AJMoTA2l0FI0OhyOow9NHqY2Yydfc8OC4fSQk; _ga_S38YJXH2G2=GS2.1.s1771169481$o17$g0$t1771169481$j60$l0$h0; _ga=GA1.2.1181596565.1746956574; _gid=GA1.2.115180035.1771169482; _gat_UA-1548748-1=1; thisamericanlife-takeover=true",
      "Referer": "https://www.thisamericanlife.org/archive?__cf_chl_tk=odPcYbnydm1tUl6gSUO7d1NWHfWx9NZLOBqEy_RIpYg-1771169469-1.0.1.1-vRD6pFDoG2vrYMNzaYpYFeh5WbPpRLfHhTedFKv8ag4"
    },
    "body": null,
    "method": "GET"
  }).then((res) => res.text())
}

export async function loadArchivePageData() {
  const content = await fetchPage();
  console.log({link, contentLength: content.length});
  console.log("content.length", content.length);
  await writeFile('./tmp/archive.html', content);
  console.log("content", './tmp/archive.html');

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

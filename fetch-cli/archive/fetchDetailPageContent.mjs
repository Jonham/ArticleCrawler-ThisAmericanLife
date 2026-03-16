import { load } from "cheerio";
import { getAttr } from "./getAttr.mjs";
import { getItemFromList } from "./getItemFromList.mjs";

export function fetchDetailPageContent(rawContent, rawMetadata) {
  const $ = load(rawContent.replaceAll("&nbsp;", " "));
  const title = $(".episode-title h1").text();
  const items = getItemFromList($(".field-type-text-with-summary p"));
  const brief = items.children[0].data.trim();
  const mainArticle = $("#main article.view-full")[0];

  const number = +getAttr(mainArticle, "data-episode");
  const script = $("#playlist-data").text().trim();
  if (!script) {
    console.log(rawContent);
    throw new Error(`Article ${number} receive empty script`);
  }

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

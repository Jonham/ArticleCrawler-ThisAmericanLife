/**
 * 无依赖，可直接在 thisamericanlife.org 页面打开后，粘贴到浏览器 Console 执行
 * 用法：先打开 https://www.thisamericanlife.org/archive ，本地启动 main.server (localhost:3030)，然后 F12 -> Console -> 粘贴运行
 *
 * - 数据会 POST 到 localhost:3030/new-article 并保存到本地
 * - 数据同时收集到 window.TAL_articles
 * - 抓取更多: TAL_run(50)
 */
(function () {
  const ARCHIVE_URL = "https://www.thisamericanlife.org/archive";
  const getAttr = (el, name, def = "") => (el && el.getAttribute?.(name)) || def;
  const first = (list) => (Array.isArray(list) ? list[0] : list?.[0]) ?? null;

  function parseHTML(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html.replace(/&nbsp;/g, " "), "text/html");
  }

  async function loadArchivePageData() {
    const doc = document.body
    const articles = doc.querySelectorAll("#main article");
    const dataList = [];

    articles.forEach((el) => {
      const linkEl = first(el.querySelectorAll("a"));
      const link = getAttr(linkEl, "href");
      if (!link) return;
      const index = getAttr(el, "data-episode");
      const title = el.querySelector("h2")?.textContent?.trim() || "";
      const description = el.querySelector(".content")?.textContent?.trim() || "";
      const coverThumbnail = getAttr(first(el.querySelectorAll("img")), "src");
      const updateDate = el.querySelector(".date-display-single")?.textContent?.trim() || "";

      dataList.push({
        index,
        link: link.startsWith("http") ? link : `https://www.thisamericanlife.org${link}`,
        title,
        description,
        coverThumbnail,
        updateDate,
      });
    });

    console.log("Archive loaded:", dataList.length, "episodes");
    return dataList;
  }

  function fetchDetailPageContent(rawContent, rawMetadata) {
    const doc = parseHTML(rawContent);
    const title = doc.querySelector(".episode-title h1")?.textContent?.trim() || "";
    const firstP = first(doc.querySelectorAll(".field-type-text-with-summary p"));
    const brief = (firstP?.textContent?.trim() ?? firstP?.childNodes?.[0]?.textContent?.trim()) || "";
    const mainArticle = doc.querySelector("#main article.view-full");
    const number = +(mainArticle ? getAttr(mainArticle, "data-episode") : 0);

    const scriptEl = doc.querySelector("#playlist-data");
    const script = scriptEl?.textContent?.trim();
    if (!script) {
      console.warn("No playlist-data for episode", number);
      return null;
    }

    let scriptData;
    try {
      scriptData = JSON.parse(script);
    } catch (e) {
      console.warn("Parse playlist-data failed", e);
      return null;
    }

    const coverEl = doc.querySelector(".tal-episode-image > img");
    const coverURL = coverEl ? getAttr(coverEl, "src") : "";
    const audioURL = scriptData.audio || "";
    const preUpdateTime = doc.querySelector("#main .episode-header .date-display-single")?.textContent?.trim() || "";
    const isUpdate = rawMetadata.updateDate !== preUpdateTime;

    const actList = [];
    doc.querySelectorAll("#main .field-name-field-acts article").forEach((i) => {
      const actTitle = i.querySelector(".act-header a")?.textContent?.trim() || "";
      const actBrief = i.querySelector(".field-type-text-with-summary p")?.textContent?.trim() || "";
      const author = i.querySelector(".field-name-field-contributor a")?.textContent?.trim() || "";
      const indexLabel = i.querySelector(".field-name-field-act-label .field-item")?.textContent?.trim() || "";
      const songRaw = i.querySelector(".field-name-field-song .field-item")?.textContent?.trim() || "";
      const song = songRaw
        ? [{
            raw: songRaw,
            name: songRaw.split("by")[0]?.trim() ?? "",
            singer: songRaw.split("by")[1]?.trim() ?? "",
          }]
        : [];

      actList.push({
        index: indexLabel,
        title: actTitle,
        brief: actBrief,
        author,
        timestamp: 0,
        song,
      });
    });

    return {
      number,
      title,
      brief,
      preUpdateTime: isUpdate ? preUpdateTime : "",
      isUpdate,
      updateTime: rawMetadata.updateDate,
      coverURL,
      audioURL,
      acts: actList,
    };
  }

  async function run(limit = 10) {
    window.TAL_articles = window.TAL_articles || [];
    const dataList = await loadArchivePageData();
    const list = dataList.slice(0, limit);

    const logProgress = (currentIndex, items) => {
      console.log(
        items
          .map(
            (article, index) =>
              `${index === currentIndex ? "⏳" : "✅"} ${article.index}. ${article.title}`
          )
          .join("\n")
      );
    };

    for (let i = 0; i < list.length; i++) {
      logProgress(i, list);
      const item = list[i];
      if (!item.index) {
        console.log("index not found, skip", item);
        continue;
      }

      const content = await fetch(item.link).then((r) => r.text());
      const article = fetchDetailPageContent(content, item);
      if (!article) {
        console.error("article is empty", item);
        continue;
      }

      window.TAL_articles.push(article);
      await fetch("http://localhost:3030/new-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      }).then((r) => (r.ok ? console.log("→ localhost:3030 OK", article.number) : r.text().then(console.warn)));
      console.log("Saved episode", article.number, article.title);
    }

    logProgress(list.length, list);
    console.log("\n✅ 完成！数据在 window.TAL_articles");
    console.log("复制到剪贴板: copy(JSON.stringify(window.TAL_articles))");
    return window.TAL_articles;
  }

  window.TAL_run = run;
  // 立即执行：默认抓取前 10 条；也可稍后执行 TAL_run(20) 抓取更多
  run(10);
})();

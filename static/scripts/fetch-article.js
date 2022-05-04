// fetch info from HTML
function getImageSrc(selector, parent = document, getBgImage = false) {
  const cover = parent.querySelector(selector);
  if (!cover) return;

  if (getBgImage && cover.tagName !== "IMG" && cover.tagName !== "VIDEO") {
    const computedStyle = getComputedStyle(cover);
    if (computedStyle.backgroundImage) {
      const m = computedStyle.backgroundImage.match(/url\("(.+)"\)/);
      if (m) {
        return m[1];
      }
    }
  }
  return cover["src"] || cover["currentSrc"];
}

function getTextContent(selector, parent = document) {
  const elem = parent.querySelector(selector);
  if (!elem) {
    console.error(selector, "get none");
    return "";
  }
  return replaceHTMLContent(elem["textContent"].trim());
}

function replaceHTMLContent(raw) {
  // replace &npsp;
  raw = raw.replaceAll("&nbsp;", " ");
  // <em>xxx</em>
  raw = raw.replace(/<em>(.+?)<\/em>/g, `**$1**`);
  return raw;
}

function getSpeakers(selector, parent = document) {
  const elems = parent.querySelectorAll(selector);
  if (!elems) {
    console.error(selector, "get none");
    return "";
  }
  return Array.from(elems).map((i) => i.textContent.trim());
}

// "byline": "By <a href=\"/archive?contributor=8731\">Ira Glass</a>, <a href=\"/archive?contributor=8813\">David Kestenbaum</a>"
function parseLine(s) {
  if (!s) return [];
  const l = s.match(/>(.+?)<\/a>/g);
  if (l) {
    return l.map((i) => i.slice(1, i.length - 4));
  }
  return [];
}

function main() {
  const s = Array.from(document.scripts).find(
    (i) => i.id === "playlist-data"
  ).innerHTML;
  const brief = JSON.parse(s);

  const coverURL =
    getImageSrc(".episode-image img,video") ||
    getImageSrc(".episode-image .image", document, true);
  const summaryText = getTextContent(
    ".field-type-text-with-summary .field-item"
  );
  const dateText = getTextContent(".date-display-single");

  const acts = Array.from(
    document.querySelectorAll(".field-name-field-acts .node-act")
  );
  const actList = acts.map((i) => {
    const tag = getTextContent(".field-name-field-act-label", i);
    const song = getTextContent(".field-name-field-song a", i);
    const title = getTextContent(".act-header a.goto-act", i);
    const briefContent = getTextContent(".field-name-body", i);
    const speakers = getSpeakers(
      ".field-name-field-contributor .field-items a",
      i
    );

    return {
      title,
      tag,
      song,
      speakers,
      briefContent,
    };
  });

  const [_, name] = brief.title.split(":");
  const result = {
    number: brief.episode,
    title: name.trim(),
    brief: summaryText,
    updateTime: dateText,
    coverURL,
    audioURL: brief.audio,
    acts:
      brief.acts.length > 1
        ? brief.acts.map((i) => {
            const { summary, name, byline, timestamp } = i;
            const [_name, title] = name.split(": ");
            let index = name === "Prologue" ? "Prologue" : _name;

            const authors = parseLine(byline);
            const author = authors.join(", ");
            const ext = actList.find((i) => i.title === title);
            const song = [];
            if (ext) {
              if (ext.song) {
                const [quoteName, singer] = ext.song.split(" by ");
                song.push({
                  raw: ext.song,
                  singer,
                  name: quoteName.slice(1, quoteName.length - 1),
                });
              }
            }
            return {
              index,
              title: title || name,
              brief: replaceHTMLContent(summary),
              author,
              timestamp,
              song,
            };
          })
        : actList.map((i) => {
            const song = [];
            if (i.song) {
              const [quoteName, singer] = i.song.split(" by ");
              song.push({
                raw: i.song,
                singer,
                name: quoteName.slice(1, quoteName.length - 1),
              });
            }
            return {
              index: i.tag,
              title: i.title,
              brief: replaceHTMLContent(i.briefContent),
              author: i.speakers.join(", "),
              timestamp: 0,
              song,
            };
          }),
  };

  fetch("http://localhost:3000/new-article", {
    body: JSON.stringify(result),
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
  });
  return result;
}

main();

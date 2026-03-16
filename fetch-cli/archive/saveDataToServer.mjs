$.verbose = false;

export async function saveDataToServer(result) {
  return fetch("http://0.0.0.0:3030/new-article", {
    headers: { "content-type": "application/json" },
    body: JSON.stringify(result),
    method: "POST",
  }).then(async (res) => {
    const t = res.headers.get("content-type");
    if (t !== "application/json" && !t.includes("json")) {
      const text = await res.text();
      console.log(text);
      return text;
    }
    return res.json();
  });
}

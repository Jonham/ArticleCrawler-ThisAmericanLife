import { downloadMediaFile } from "./fetch-media-file-from-url";

const main = async () => {
  const link =
    "https://pfx.vpixl.com/6qj4J/dts.podtrac.com/redirect.mp3/chtbl.com/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/bbbcc290-ed3b-44a2-8e5d-5513e38cfe20/episodes/67ea2560-6f40-4c9a-bc11-61627cc915e7/audio/128/default.mp3?awCollectionId=bbbcc290-ed3b-44a2-8e5d-5513e38cfe20&awEpisodeId=67ea2560-6f40-4c9a-bc11-61627cc915e7";

  await downloadMediaFile(link, "test2.mp3", {
    onProgress: (n) => console.log(n.toFixed(2) + "%"),
  });
};

main();

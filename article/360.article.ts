import { ArticleProto } from '../parseContent'

export const info: ArticleProto = {
  number: 360,
  title: 'Switched at Birth',
  brief:
    'On a summer day in 1951, two baby girls were born in a hospital in small-town Wisconsin. The infants were accidentally switched, and went home with the wrong families.',
  preUpdateTime: 'July 25, 2008',
  isUpdate: true,
  updateTime: 'Apr. 15, 2022',
  coverURL:
    'https://hw3.thisamericanlife.org/sites/default/files/styles/landscape/public/episodes/images/owen_freeman_switched_at_birth_final.jpg?itok=3a07e5tX',
  audioURL:
    'https://dts.podtrac.com/redirect.mp3/chtbl.com/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/bbbcc290-ed3b-44a2-8e5d-5513e38cfe20/episodes/dadcf085-d406-4452-b56d-24c2be09b36e/audio/128/default.mp3?awCollectionId=bbbcc290-ed3b-44a2-8e5d-5513e38cfe20&awEpisodeId=dadcf085-d406-4452-b56d-24c2be09b36e',
  acts: [
    {
      index: 'Prologue',
      title: 'Prologue',
      brief:
        "Host Ira Glass introduces four characters: Kay McDonald, who raised a daughter named Sue, and Mary Miller, who raised a daughter named Marti. In 1994, Mary Miller wrote letters to Sue and Marti, confessing the secret she'd kept for 43 years: The daughters had been switched at birth and raised by the wrong families.",
      author: 'Ira Glass',
      timestamp: 0,
      song: [],
    },
    {
      index: 'Act One',
      title: 'Act One',
      brief:
        'Reporter Jake Halpern tells the story of Marti Miller and Sue McDonald, the daughters who were switched at birth, and the many complications that came with learning the truth.',
      author: 'Jake Halpern',
      timestamp: 396,
      song: [],
    },
    {
      index: 'Act Two',
      title: 'Act Two',
      brief:
        "Jake Halpern tells the mothers' sides of the story. At 69, Kay McDonald had to cope not only with the news that her daughter wasn't her own, but that another mother had known the whole time.",
      author: 'Jake Halpern',
      timestamp: 1865,
      song: [
        {
          raw: '“Hello Mother” by The Canton Spirituals',
          singer: 'The Canton Spirituals',
          name: 'Hello Mother',
        },
      ],
    },
  ],
}

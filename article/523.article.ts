import { ArticleProto } from '../parseContent'

export const info: ArticleProto = {
  number: 523,
  title: 'Death and Taxes',
  brief:
    'It is a peculiar feeling to know with certainty that something big is about to happen to you. This week, we watch people go right up to the edge of inevitable change.',
  preUpdateTime: 'April 25, 2014',
  isUpdate: true,
  updateTime: 'March 25, 2022',
  coverURL:
    'https://hw2.thisamericanlife.org/sites/default/files/styles/landscape/public/episodes/images/523.jpg?itok=SKl4dSoq',
  audioURL:
    'https://dts.podtrac.com/redirect.mp3/chtbl.com/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/bbbcc290-ed3b-44a2-8e5d-5513e38cfe20/episodes/d99eccca-6579-45c3-b591-24d4a1507fdd/audio/128/default.mp3?awCollectionId=bbbcc290-ed3b-44a2-8e5d-5513e38cfe20&awEpisodeId=d99eccca-6579-45c3-b591-24d4a1507fdd',
  acts: [
    {
      index: 'Prologue',
      title: 'Prologue',
      brief:
        'When you are a preteen you walk around every day with the knowledge that your body is about to change. You don’t know exactly when or how. All you know is that it will happen and you will come out the other side a different person. We hear from kids who are reluctantly facing puberty any minute now. ',
      author: 'Ira Glass',
      timestamp: 0,
      song: [],
    },
    {
      index: 'Act One',
      title: 'Death',
      brief:
        "Producer Nancy Updike takes some personal questions about death and dying to a place where they're happening all the time.",
      author: 'Nancy Updike',
      timestamp: 274,
      song: [],
    },
    {
      index: 'Act Two',
      title: 'Taxes',
      brief:
        'Al Drucker used to work for the IRS doing tax enforcement. One thing he found really helpful in the job was when someone from the public would give a tip on who he should look into.So when Al retired from the IRS five years ago, he created a website where you can anonymously rat out your neighbors, exes, and friends to the IRS.',
      author: 'David Kestenbaum',
      timestamp: 2508,
      song: [
        {
          raw: '“What If We All Stopped Paying Taxes” by Sharon Jones & The Dap-Kings',
          singer: 'Sharon Jones & The Dap-Kings',
          name: 'What If We All Stopped Paying Taxes',
        },
      ],
    },
  ],
}

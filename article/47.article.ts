import { ArticleProto } from '../parseContent'

export const info: ArticleProto = {
  number: 47,
  title: 'Christmas and Commerce',
  brief:
    'Stories about the intersection of Christmas and retail, originally broadcast in 1996 when our show was only a year old. Including David Sedaris\'s story "Santaland Diaries," which first aired on NPR\'s Morning Edition in a much shorter version.',
  updateTime: 'December 24, 2021',
  isUpdate: true,
  preUpdateTime: 'December 20, 1996',
  coverURL:
    'https://hw3.thisamericanlife.org/sites/default/files/styles/portrait/public/episodes/images/47-portrait.jpg?itok=myTfexyw',
  audioURL:
    'https://dts.podtrac.com/redirect.mp3/chtbl.com/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/bbbcc290-ed3b-44a2-8e5d-5513e38cfe20/episodes/e9fb3b63-aecb-48f3-bead-fce97926efa3/audio/128/default.mp3?awCollectionId=bbbcc290-ed3b-44a2-8e5d-5513e38cfe20&awEpisodeId=e9fb3b63-aecb-48f3-bead-fce97926efa3',
  acts: [
    {
      index: 'Act One',
      title: 'Toys R Us',
      brief:
        "Host Ira Glass goes to one of the epicenters of modern&nbsp;Christmas —&nbsp;the world's biggest toy store —&nbsp;minutes before closing on&nbsp;Christmas&nbsp;Eve.&nbsp; (5 1/2&nbsp;minutes)",
      author: 'Ira Glass',
      timestamp: 0,
      song: [],
    },
    {
      index: 'Act Two',
      title: 'Santaland Diaries',
      brief:
        "Writer David Sedaris's true account of two&nbsp;Christmas&nbsp;seasons he spent working as an elf at Macy's&nbsp;department store in New York.&nbsp; When a shorter version of this story first aired on NPR's <em>Morning&nbsp;Edition</em>, it generated more tape requests than any story in the show's history to that point. David’s latest book is <em>A Carnival of Snackery: Diaries (2003-2020)</em>.",
      author: 'David Sedaris',
      timestamp: 328,
      song: [
        {
          raw: '“Santa Baby” by Michelle Malone',
          singer: 'Michelle Malone',
          name: 'Santa Baby',
        },
      ],
    },
    {
      index: 'Act Three',
      title: 'Christmas Freud',
      brief:
        "David Rakoff tells about his experience playing Sigmund Freud in the window of upscale Barney's&nbsp;department store in Manhattan. For&nbsp;Christmas.&nbsp;This was the first of dozens of appearances on our show by David Rakoff, who died in 2012.",
      author: 'David Rakoff',
      timestamp: 2277,
      song: [],
    },
    {
      index: 'Act Four',
      title: 'Act Four',
      brief:
        'Tapes recorded in a Chicago home&nbsp;Christmas&nbsp;morning, more than 50 years ago.',
      author: 'John Connors',
      timestamp: 3316,
      song: [],
    },
  ],
}

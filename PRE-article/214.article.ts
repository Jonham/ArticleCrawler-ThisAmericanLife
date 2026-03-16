import { ArticleProto } from '../parseContent'

export const info: ArticleProto = {
  number: 214,
  title: 'Family Physics',
  brief:
    'We take the stately laws of physics—laws which mathematicians and scientists have spent centuries discovering and verifying—and apply them to the realm of human relationships, to see if they shed useful light on our daily lives.',
  updateTime: 'December 17, 2021',
  isUpdate: true,
  preUpdateTime: 'May 31, 2002',
  coverURL:
    'https://hw1.thisamericanlife.org/sites/default/files/styles/landscape/public/episodes/images/214-1200.jpg?itok=CZLaeell',
  audioURL:
    'https://dts.podtrac.com/redirect.mp3/chtbl.com/t========rack/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/bbbcc290-ed3b-44a2-8e5d-5513e38cfe20/episodes/82e05c54-535a-49ba-b0ec-dd4c0bb0dd64/audio/128/default.mp3?awCollectionId=bbbcc290-ed3b-44a2-8e5d-5513e38cfe20&awEpisodeId=82e05c54-535a-49ba-b0ec-dd4c0bb0dd64',
  acts: [
    {
      index: 'Prologue',
      title: 'Prologue',
      brief:
        'We hear two stories of everyday life which are more easily understood if one knows some of the laws of physics, specifically the Mediocrity Principle and the Casimir Effect.',
      author: 'Ira Glass, David Kestenbaum',
      timestamp: 0,
      song: [],
    },
    {
      index: 'Act One',
      title: "Occam's Razor",
      brief:
        'In Los Angeles, Cris Beam reports on a family named the Paladinos that had a theory that explained their lives. And then, at some point, that theory came to seem inadequate.',
      author: 'Cris Beam',
      timestamp: 450,
      song: [],
    },
    {
      index: 'Act Two',
      title: 'The Trajectory and Force of Bodies in Orbit',
      brief:
        'Jon Ronson tells the story of how his parents decided to commission a family portrait, and how things went awry because of the brilliant but troubled local artist they hired for the job. In the story, Jon circles in a reluctant orbit around his parents, and his parents are in a rather energetic orbit of their own.',
      author: 'Jon Ronson',
      timestamp: 2304,
      song: [
        {
          raw: '“Stars in My Life” by The Flatlanders',
          singer: 'The Flatlanders',
          name: 'Stars in My Life',
        },
      ],
    },
    {
      index: 'Act Three',
      title: 'Conservation Of Energy And Matter',
      brief:
        'David Sedaris outlines an experiment he conducted with fluids and a tube and a bag. The result: The Stadium Pal.',
      author: 'David Sedaris',
      timestamp: 3172,
      song: [
        {
          raw: '“I Am a Scientist” by Guided by Voices',
          singer: 'Guided',
          name: 'I Am a Scientist',
        },
      ],
    },
  ],
}

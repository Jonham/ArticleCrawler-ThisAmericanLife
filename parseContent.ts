export type ArticleSong = {
  raw: string
  name: string
  singer: string
}

export type ArticleAct = {
  index?: string
  title: string
  author: string
  brief: string
  timestamp: number
  /** 格式化的时间标签 */
  timestampFormat?: string
  song?: ArticleSong[]
}

export type ArticleProto = {
  title: string
  brief: string
  number: number
  audioOffset?: number
  updateTime?: string
  /** 封面图 */
  coverURL?: string
  /** 音频链接 */
  audioURL?: string

  /** 是否翻新 */
  isUpdate?: boolean
  preUpdateTime?: string

  acts: ArticleAct[]
}

export type ArticleContentQuery = {
  // field: string
  query: string
  t: 'string' | 'number' | 'date' | 'list'
  childQuery?: ArticleContentQuery
  queryFn?: () => string
  resultParser?: (t: string) => string
}

export type ArticleContentListQuery<ChildQuery> = {
  // field: string
  query: string
  t: 'list'
  childQuery: ChildQuery
  queryFn?: () => string
  resultParser?: (t: string) => string
}

export type ArticleActSongQueryProto = {
  raw: ArticleContentQuery
  name?: ArticleContentQuery
  author?: ArticleContentQuery
}

export type ArticleActQueryProto = {
  index?: ArticleContentQuery
  title: ArticleContentQuery
  author: ArticleContentQuery
  brief: ArticleContentQuery
  song?: ArticleContentListQuery<ArticleActSongQueryProto>
}

export type ArticleQueryProto = {
  title: ArticleContentQuery
  brief: ArticleContentQuery
  number: ArticleContentQuery
  updateTime?: ArticleContentQuery

  /** 是否翻新 */
  isUpdate?: ArticleContentQuery
  preUpdateTime?: ArticleContentQuery

  acts: ArticleContentListQuery<ArticleActQueryProto>
}

const actSongQuery: ArticleActSongQueryProto = {
  raw: {
    query: 'article .field-name-field-episode-number .field-item',
    t: 'number',
  },
}

const articleActQuery: ArticleActQueryProto = {
  index: {
    query: 'article .field-name-field-episode-number .field-item',
    t: 'number',
  },
  title: {
    query: 'article .field-name-field-episode-number .field-item',
    t: 'number',
  },
  author: {
    query: 'article .field-name-field-episode-number .field-item',
    t: 'number',
  },
  brief: {
    query: 'article .field-name-field-episode-number .field-item',
    t: 'number',
  },
  song: {
    query: 'article .field-name-field-episode-number .field-item',
    t: 'number',
  },
}

export const proto: ArticleQueryProto = {
  title: {
    query: 'article h1',
    t: 'string',
  },
  number: {
    query: 'article .field-name-field-episode-number .field-item',
    t: 'number',
  },
  brief: {
    query: 'article .field-type-text-with-summary p',
    t: 'string',
  },
  updateTime: {
    query: 'article .field-type-date .date-display-single',
    t: 'date',
  },
  acts: {
    query: 'article .content .field-item',
    t: 'list',
    childQuery: articleActQuery,
  },
}

export const result = `660: Hoaxing Yourself
========
People who tell a lie and then believe the lie more than anyone else. 

November 19, 2021 | November 2, 2018
An updated version of an episode from 2000.
========

Prologue - By Ira Glass
========
Sean Cole explains why he decided that he would speak with a British accent—morning, noon and night—from the age of fourteen until he was sixteen, and how he believed the lie that he was British must be true. (3 minutes)

Act One: The Sun Never Sets—On The Moosewood Restaurant - By Ira Glass
========
The story of two young people who, in their search to figure out who they were, pretended to be people they weren't. Both were from small towns; both took on false identities. For two years in high school, producer Sean Cole spoke with a British accent. As a freshman in college, Joel Lovell told lies about his own diet and about his parents. Joel is the executive editor of the podcast company Pineapple Street Media. (15 minutes)
- Song: “Meat” by Noise Addict

Act Two: Conning The Con Men - By Nancy Updike
========
The story of a con man, one of the most successful salesmen in a long-running multimillion-dollar telemarketing scam, who finally got caught when he was conned himself. Producer Nancy Updike talks about the case with Dale Sekovich, Federal Trade Commission investigator. (16 minutes)

Act Three: Oedipus Hex - By Shalom Auslander
========
Shalom Auslander reads his true story, "The Blessing Bee." It's about the time when, as a third-grader at an Orthodox Jewish school, Shalom saw his chance to both make his mom proud, and push his drunken father out of the picture. Part of his scheme involved winning the school's bee on the complicated Hebrew blessings you say before eating certain foods. The other part of the scheme: Sinning. This story is included in Shalom's memoir Foreskin's Lament. His most recent book is Mother for Dinner. (19 minutes)
- Song:“(He's) The Great Imposter” by The Fleetwoods`

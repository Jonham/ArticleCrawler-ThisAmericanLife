import { ArticleAct, ArticleProto, ArticleSong } from './parseContent'

const SEPARATOR = '========'
export function stringifySong(song: ArticleSong): string {
  return `- Song: "${song.name}" by ${song.singer}`
}

export function articleActToString(
  act: ArticleAct,
  audioOffset?: number
): string {
  if (audioOffset !== undefined) {
    parseTimestamp(act, audioOffset)
  }
  const { index, title, author, brief, song, timestampFormat } = act

  let tail = ''
  if (song) {
    tail = song.map(i => stringifySong(i)).join('\n')
  }

  return (
    `${
      timestampFormat ? timestampFormat + ' ' : ''
    }${index}: ${title}${author ? ' - By ' + author : ''}
${SEPARATOR}
${brief}` + (tail && `\n${tail}`)
  )
}

function parseTimestamp(act: ArticleAct, audioOffset = 0) {
  const { timestamp } = act
  const total = timestamp + audioOffset
  const m = Math.floor(total / 60)
  const second = total % 60
  act.timestampFormat = `[${('00' + m).slice(-2)}:${('00' + second).slice(-2)}]`
}

export function articleInfoToString(info: ArticleProto): string {
  const actStr = info.acts
    .map(i => articleActToString(i, info.audioOffset))
    .join('\n\n')

  return `audioTitle:
${audioTitle(info)}

${info.number}: ${info.title}
${SEPARATOR}
${info.brief}

${info.isUpdate ? info.preUpdateTime + '\n' : ''}${info.updateTime}
${SEPARATOR}

${actStr}
`
}

// 660: Hoaxing Yourself [Nov.2,2018] [Nov.19,2021]
export function audioTitle(info: ArticleProto): string {
  const { isUpdate, preUpdateTime } = info
  if (isUpdate) {
    return `${info.number}: ${info.title} [${parseShortTimestamp(
      preUpdateTime || ''
    )}] [${parseShortTimestamp(info.updateTime || '')}]`
  }

  return `${info.number}: ${info.title} [${parseShortTimestamp(
    info.updateTime || ''
  )}]`
}

// November 26, 2021
export function parseShortTimestamp(t: string): string {
  const d = new Date(t)
  const s = d.toDateString()

  const [_, month, day, year] = s.split(' ')
  return `${month}.${day},${year}`
}

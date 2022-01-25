import * as Hapi from '@hapi/hapi'
import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { ArticleProto } from './parseContent'
import axios from 'axios'
import path = require('path')
import { transform } from './transform'

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    routes: {
      files: {
        relativeTo: path.resolve(__dirname, 'static'),
      },
    },
  })

  server.route({
    method: 'POST',
    path: '/new-article',
    config: {
      cors: true,
    },
    handler: async (req, h) => {
      let data = h.request.payload
      if (typeof data !== 'object') {
        data = JSON.parse(data)
      }

      // console.log(data)
      await saveFile(data)
      transform()
      return 'ok'
    },
  })
  await server.start()
  console.log('server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()

async function saveFile(data: ArticleProto) {
  const number = data.number
  console.log('saving article', number)

  const articleContent = `import { ArticleProto } from '../parseContent'

export const info: ArticleProto =${JSON.stringify(data, null, '  ')}`

  const filename = resolve(__dirname, `./article/${number}.article.ts`)
  writeFileSync(filename, articleContent)

  // 下载内容
  const mediaFolder = resolve(__dirname, `./article/media/${number}/`)
  mkdirSync(mediaFolder, { recursive: true })

  if (data.coverURL) {
    await fetchMedia(data.coverURL, number, mediaFolder)
  }
  if (data.audioURL) {
    await fetchMedia(data.audioURL, number, mediaFolder)
  }
}

async function fetchMedia(link: string, number: number, mediaFolder: string) {
  const m = link.match(/\.(png|jpg|jpeg|gif|webp|mp3)/)
  let suffix = m ? m[0] : '.png'

  const responseType = 'arraybuffer'
  const res = await axios.get(link, { responseType })

  console.log(`audio-${number}${suffix}`, res.data.length)
  const mediaType = suffix === '.mp3' ? 'audio' : 'img'
  writeFileSync(`${mediaFolder}/${mediaType}-${number}${suffix}`, res.data)
}

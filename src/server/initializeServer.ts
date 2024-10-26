import path from 'path'

import express, { Router } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

export default function initializeServer(router: Router) {
  const app = express()
  const isProduction = process.env.NODE_ENV === 'production'
  const origin = { origin: isProduction ? false : '*' }
  const payloadLimit = process.env.PAYLOAD_LIMIT || '20mb'
  app.set('trust proxy', 1)
  app.use(express.json({ limit: payloadLimit }))
  app.use(express.urlencoded({ limit: payloadLimit, extended: true }))
  app.use(cookieParser())
  app.use(cors(origin))
  app.use(helmet())
  app.use(compression())

  app.use((request, response, next) => {
    response.header('Content-Security-Policy', "img-src 'self' *.githubusercontent.com")

    return next()
  })

  app.use(express.static(path.join(__dirname, '../../dist/')))
  app.use('/api', router)
  app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../../dist/index.html'))
  })

  return app
}

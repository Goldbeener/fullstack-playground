import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { corsMiddleware } from './middleware/cors.js'
import { loggerMiddleware } from './middleware/logger.js'

import router from './routes/index.js'

const app = new Hono()

app.use('*', loggerMiddleware)
app.use('*', corsMiddleware)
app.get('/health', (c) => c.json({ status: 'ok' }))
app.route('/', router)

function startServer(port: number) {
  const server = serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') startServer(port + 1)
    else throw err
  })
}

startServer(3000)

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { corsMiddleware } from './middleware/cors.js'
import { loggerMiddleware } from './middleware/logger.js'
import router from './routes/index.js'

const app = new Hono()

app.use('*', loggerMiddleware)
app.use('*', corsMiddleware)
app.route('/', router)

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = 3000
console.log(`Server running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })

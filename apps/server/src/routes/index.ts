import { Hono } from 'hono'
import sseRouter from './sse/index.js'

const router = new Hono()

router.route('/sse', sseRouter)

export default router

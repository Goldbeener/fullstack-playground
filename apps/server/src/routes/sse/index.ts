import { Hono } from 'hono'
import demo from './demo.js'
import llm from './llm.js'
import realtime from './realtime.js'
import chunked from './chunked.js'

const sseRouter = new Hono()

sseRouter.route('/demo', demo)
sseRouter.route('/llm', llm)
sseRouter.route('/realtime', realtime)
sseRouter.route('/chunked', chunked)

export default sseRouter

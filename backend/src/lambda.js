import 'dotenv/config'
import serverless from 'serverless-http'
import app from './app.js'

export const handler = serverless(app, {
  binary: ['application/pdf', 'application/octet-stream', 'multipart/form-data'],
})

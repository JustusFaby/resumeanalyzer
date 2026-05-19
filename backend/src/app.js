import express from 'express'
import cors from 'cors'
import resumeRoutes from './routes/resumeRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { awsConfig, isAwsConfigured } from './config/aws.js'
import { requireAuth } from './middlewares/auth.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Cloud Resume Analyzer Backend',
    awsConfigured: isAwsConfigured(),
    region: awsConfig.region,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/resumes', requireAuth, resumeRoutes)
app.use(errorHandler)

export default app

import { v4 as uuidv4 } from 'uuid'
import { analyzeResumeText } from '../services/analysisService.js'
import { saveUploadedResume, getUploadedResumeById, saveReport, getAllReports, getReportById } from '../services/reportService.js'
import { uploadResumeToS3 } from '../services/s3Service.js'
import { extractTextFromResume } from '../services/textractService.js'

function createHttpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export async function uploadResume(req, res, next) {
  try {
    const userId = req.userId
    if (!req.file) {
      throw createHttpError(400, 'Resume PDF file is required in the "resume" field.')
    }

    const extractedText = await extractTextFromResume({
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
    })

    const s3Result = await uploadResumeToS3({
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
    })

    const uploadRecord = saveUploadedResume({
      uploadId: uuidv4(),
      userId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText,
      s3Key: s3Result.key,
      createdAt: new Date().toISOString(),
    })

    res.status(201).json({
      message: 'Resume uploaded successfully.',
      uploadId: uploadRecord.uploadId,
      fileName: uploadRecord.fileName,
      createdAt: uploadRecord.createdAt,
      extractedTextPreview: extractedText.slice(0, 220),
      storage: s3Result.uploaded ? 's3' : 'local-memory',
    })
  } catch (error) {
    next(error)
  }
}

async function resolveResumeText(req) {
  const { uploadId, resumeText } = req.body
  const userId = req.userId

  if (isNonEmptyString(resumeText)) {
    return resumeText.trim()
  }

  if (req.file) {
    const extractedText = await extractTextFromResume({
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
    })

    const s3Result = await uploadResumeToS3({
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
    })

    saveUploadedResume({
      uploadId: uuidv4(),
      userId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText,
      s3Key: s3Result.key,
      createdAt: new Date().toISOString(),
    })

    return extractedText
  }

  if (isNonEmptyString(uploadId)) {
    const existingUpload = getUploadedResumeById(uploadId.trim(), userId)
    if (!existingUpload) {
      throw createHttpError(404, `No uploaded resume found for uploadId: ${uploadId}`)
    }

    return existingUpload.extractedText
  }

  throw createHttpError(400, 'Provide one of: resume PDF file, uploadId, or resumeText.')
}

export async function analyzeResume(req, res, next) {
  try {
    const userId = req.userId
    const { jobDescription, targetRole } = req.body

    if (!isNonEmptyString(targetRole)) {
      throw createHttpError(400, 'targetRole is required.')
    }

    const normalizedJobDescription = isNonEmptyString(jobDescription) ? jobDescription.trim() : ''
    const analysisJobDescription = normalizedJobDescription || targetRole.trim()

    const resumeText = await resolveResumeText(req)

    const analysis = await analyzeResumeText({
      resumeText,
      jobDescription: analysisJobDescription,
      targetRole: targetRole.trim(),
    })

    const report = await saveReport({
      reportId: uuidv4(),
      userId,
      fileName: req.file?.originalname || 'resume.pdf',
      jobDescription: normalizedJobDescription,
      overallScore: analysis.overallScore,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      extractedSkills: analysis.extractedSkills,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendations: analysis.recommendations,
      targetRole: analysis.targetRole,
      createdAt: new Date().toISOString(),
    })

    res.status(200).json(report)
  } catch (error) {
    next(error)
  }
}

export async function getResumes(_req, res, next) {
  try {
    const reports = await getAllReports(_req.userId)
    res.status(200).json({
      count: reports.length,
      reports,
    })
  } catch (error) {
    next(error)
  }
}

export async function getResumeById(req, res, next) {
  try {
    const report = await getReportById(req.params.id, req.userId)

    if (!report) {
      throw createHttpError(404, `Report not found for id: ${req.params.id}`)
    }

    res.status(200).json(report)
  } catch (error) {
    next(error)
  }
}

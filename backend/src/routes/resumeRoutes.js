import express from 'express'
import multer from 'multer'
import {
  uploadResume,
  analyzeResume,
  getResumes,
  getResumeById,
} from '../controllers/resumeController.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf'
    const isOctetStreamPdf =
      file.mimetype === 'application/octet-stream' && file.originalname.toLowerCase().endsWith('.pdf')

    if (!isPdfMime && !isOctetStreamPdf) {
      const error = new Error('Only PDF files are supported.')
      error.status = 400
      cb(error)
      return
    }

    cb(null, true)
  },
})

router.post('/upload', upload.single('resume'), uploadResume)
router.post('/analyze', upload.single('resume'), analyzeResume)
router.get('/', getResumes)
router.get('/:id', getResumeById)

export default router

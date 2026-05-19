import { DetectDocumentTextCommand } from '@aws-sdk/client-textract'
import { isAwsConfigured, textractClient } from '../config/aws.js'

function createMockExtractedText(fileName = 'resume.pdf') {
  return [
    `Resume File: ${fileName}`,
    'Software Engineer with 4+ years experience building web applications.',
    'Strong hands-on skills in React, Node.js, Express, JavaScript, HTML, CSS, and Git.',
    'Worked on API integrations, SQL and MongoDB data models, and CI/CD pipelines.',
    'Built Docker-based deployments and contributed to AWS cloud migration tasks.',
  ].join(' ')
}

function parseTextractText(blocks = []) {
  return blocks
    .filter((block) => block.BlockType === 'LINE' && block.Text)
    .map((block) => block.Text)
    .join(' ')
}

export async function extractTextFromResume({ fileBuffer, fileName }) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    const error = new Error('Invalid resume file. Expected a PDF buffer.')
    error.status = 400
    throw error
  }

  if (!isAwsConfigured()) {
    return createMockExtractedText(fileName)
  }

  try {
    const command = new DetectDocumentTextCommand({
      Document: {
        Bytes: fileBuffer,
      },
    })

    const response = await textractClient.send(command)
    const parsedText = parseTextractText(response.Blocks)

    if (!parsedText.trim()) {
      return createMockExtractedText(fileName)
    }

    return parsedText
  } catch (_error) {
    return createMockExtractedText(fileName)
  }
}

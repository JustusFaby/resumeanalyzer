import Groq from 'groq-sdk'

const apiKey = process.env.GROQ_API_KEY
const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

const groq = apiKey ? new Groq({ apiKey }) : null

function extractJsonBlock(text = '') {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    return null
  }

  const jsonSlice = text.slice(start, end + 1)
  try {
    return JSON.parse(jsonSlice)
  } catch (_error) {
    return null
  }
}

function normalizeStringArray(value, limit) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, limit)
}

export async function generateAnalysisWithGroq({
  resumeText,
  jobDescription,
  targetRole,
  analysisSnapshot,
}) {
  if (!groq) {
    return null
  }

  const prompt = [
    'You are an expert resume analyst. Respond ONLY with valid JSON.',
    'Return this exact JSON shape (no Markdown, no extra keys):',
    '{',
    '  "summary": "string",',
    '  "strengths": ["string"],',
    '  "weaknesses": ["string"],',
    '  "recommendations": ["string"]',
    '}',
    'Constraints:',
    '- summary: 1 sentence',
    '- strengths: 2-4 items',
    '- weaknesses: 2-4 items',
    '- recommendations: 3-6 items',
    '',
    `Target role: ${targetRole}`,
    `ATS score: ${analysisSnapshot.atsScore}`,
    `Missing keywords: ${analysisSnapshot.missingKeywords.join(', ')}`,
    `Top job keywords: ${analysisSnapshot.topJobKeywords.join(', ')}`,
    `Resume text: ${resumeText}`,
    `Job description: ${jobDescription}`,
  ].join('\n')

  try {
    const response = await groq.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 600,
    })

    const text = response?.choices?.[0]?.message?.content || ''
    const parsed = extractJsonBlock(text)

    if (!parsed) {
      return null
    }

    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
      strengths: normalizeStringArray(parsed.strengths, 4),
      weaknesses: normalizeStringArray(parsed.weaknesses, 4),
      recommendations: normalizeStringArray(parsed.recommendations, 6),
    }
  } catch (_error) {
    return null
  }
}

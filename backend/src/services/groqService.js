import Groq from 'groq-sdk'

const apiKey = process.env.GROQ_API_KEY
const model = process.env.GROQ_MODEL || 'llama-3.3-70b-specdec'

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

function clampScore(value) {
  const num = Number(value)
  if (isNaN(num)) return 0
  return Math.max(0, Math.min(100, Math.round(num)))
}

export async function generateAnalysisWithGroq({
  resumeText,
  jobDescription,
  targetRole,
}) {
  if (!groq) {
    return null
  }

  const prompt = [
    'You are an expert ATS (Applicant Tracking System) resume analyst.',
    'Analyze the resume against the job description and target role.',
    'Respond ONLY with valid JSON. No Markdown, no extra text, no code fences.',
    '',
    'Return this exact JSON shape:',
    '{',
    '  "overallScore": number,',
    '  "atsScore": number,',
    '  "summary": "string",',
    '  "matchedKeywords": ["string"],',
    '  "missingKeywords": ["string"],',
    '  "extractedSkills": ["string"],',
    '  "strengths": ["string"],',
    '  "weaknesses": ["string"],',
    '  "recommendations": ["string"]',
    '}',
    '',
    'Scoring rules:',
    '- atsScore (0-100): How well the resume matches ATS keyword requirements from the job description. Consider keyword presence, density, exact phrasing matches, and role-specific terminology.',
    '- overallScore (0-100): Holistic resume quality score factoring in ATS match, skill relevance, experience alignment, formatting clarity, and impact statements.',
    '- matchedKeywords: Important keywords/phrases from the job description that ARE found in the resume (max 20).',
    '- missingKeywords: Important keywords/phrases from the job description that are NOT in the resume (max 20).',
    '- extractedSkills: Technical and professional skills detected in the resume (max 15).',
    '- summary: 2-3 sentence analysis overview.',
    '- strengths: 2-4 specific strengths of this resume for the target role.',
    '- weaknesses: 2-4 specific weaknesses or gaps.',
    '- recommendations: 3-6 actionable improvement suggestions.',
    '',
    `Target role: ${targetRole}`,
    '',
    `Job description:\n${jobDescription}`,
    '',
    `Resume text:\n${resumeText}`,
  ].join('\n')

  try {
    const response = await groq.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1200,
    })

    const text = response?.choices?.[0]?.message?.content || ''
    const parsed = extractJsonBlock(text)

    if (!parsed) {
      return null
    }

    return {
      overallScore: clampScore(parsed.overallScore),
      atsScore: clampScore(parsed.atsScore),
      summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
      matchedKeywords: normalizeStringArray(parsed.matchedKeywords, 20),
      missingKeywords: normalizeStringArray(parsed.missingKeywords, 20),
      extractedSkills: normalizeStringArray(parsed.extractedSkills, 15),
      strengths: normalizeStringArray(parsed.strengths, 4),
      weaknesses: normalizeStringArray(parsed.weaknesses, 4),
      recommendations: normalizeStringArray(parsed.recommendations, 6),
    }
  } catch (_error) {
    return null
  }
}

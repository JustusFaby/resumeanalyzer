const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'you',
  'your',
  'from',
  'into',
  'over',
  'under',
  'have',
  'has',
  'had',
  'are',
  'was',
  'were',
  'will',
  'would',
  'should',
  'can',
  'could',
  'our',
  'their',
  'about',
  'they',
  'them',
  'then',
  'than',
  'also',
  'using',
  'used',
  'use',
  'across',
  'within',
  'between',
  'where',
  'when',
  'what',
  'who',
  'why',
  'how',
  'job',
  'role',
  'team',
  'work',
  'years',
  'year',
  'experience',
])

export function normalizeText(input = '') {
  return input.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ')
}

export function tokenize(input = '') {
  return normalizeText(input)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

export function extractKeywordsFromJobDescription(jobDescription, limit = 40) {
  const tokenFrequency = new Map()

  for (const token of tokenize(jobDescription)) {
    if (token.length < 3) {
      continue
    }

    if (STOP_WORDS.has(token)) {
      continue
    }

    tokenFrequency.set(token, (tokenFrequency.get(token) || 0) + 1)
  }

  return [...tokenFrequency.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([token]) => token)
}

export function scoreResume(resumeText, jobDescription) {
  const jdKeywords = extractKeywordsFromJobDescription(jobDescription, 40)
  const resumeTokenSet = new Set(tokenize(resumeText))

  const matchedKeywords = jdKeywords.filter((keyword) => resumeTokenSet.has(keyword))
  const missingKeywords = jdKeywords.filter((keyword) => !resumeTokenSet.has(keyword))

  const matchPercentage = jdKeywords.length
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 0

  const atsScore = Math.max(0, Math.min(100, matchPercentage))

  return {
    atsScore,
    matchPercentage,
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
  }
}

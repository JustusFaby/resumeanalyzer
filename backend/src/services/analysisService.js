import { generateAnalysisWithGroq } from './groqService.js'
import { extractKeywordsFromJobDescription, scoreResume } from '../utils/scoreResume.js'

const KNOWN_SKILLS = [
  'React',
  'Node.js',
  'AWS',
  'Docker',
  'Terraform',
  'JavaScript',
  'HTML',
  'CSS',
  'Git',
  'Express',
  'SQL',
  'MongoDB',
]

function extractSkillsFromText(input = '') {
  const text = input.toLowerCase()
  return KNOWN_SKILLS.filter((skill) => text.includes(skill.toLowerCase()))
}

function buildStrengths({ atsScore, matchedKeywords, extractedSkills }) {
  const strengths = []

  if (atsScore >= 75) {
    strengths.push('Strong overall alignment with the job description language and expectations.')
  } else if (atsScore >= 55) {
    strengths.push('Moderate keyword alignment with room to improve role-specific wording.')
  }

  if (matchedKeywords.length >= 6) {
    strengths.push(`Good keyword relevance with terms like ${matchedKeywords.slice(0, 4).join(', ')}.`)
  }

  if (extractedSkills.length >= 5) {
    strengths.push(`Solid technical coverage detected across ${extractedSkills.slice(0, 5).join(', ')}.`)
  }

  if (!strengths.length) {
    strengths.push('Resume contains foundational role-relevant experience and technical signals.')
  }

  return strengths.slice(0, 4)
}

function buildWeaknesses({ atsScore, missingKeywords, extractedSkills }) {
  const weaknesses = []

  if (missingKeywords.length) {
    weaknesses.push(`Important job terms are missing: ${missingKeywords.slice(0, 5).join(', ')}.`)
  }

  if (extractedSkills.length < 3) {
    weaknesses.push('Limited technical skills were detected in the current resume wording.')
  }

  if (atsScore < 55) {
    weaknesses.push('ATS alignment is low and may reduce shortlist visibility.')
  }

  if (!weaknesses.length) {
    weaknesses.push('No major weaknesses detected from the current keyword and skill analysis.')
  }

  return weaknesses.slice(0, 4)
}

function buildRecommendations({ targetRole, missingKeywords, extractedSkills, roleSkills }) {
  const recommendations = []

  if (missingKeywords.length) {
    recommendations.push(
      `Add role-relevant keywords naturally in project bullets, especially: ${missingKeywords
        .slice(0, 6)
        .join(', ')}.`
    )
  }

  if (roleSkills.length) {
    const missingRoleSkills = roleSkills.filter((skill) => !extractedSkills.includes(skill))
    if (missingRoleSkills.length) {
      recommendations.push(
        `Highlight direct experience for ${missingRoleSkills.slice(0, 4).join(', ')} to better match the ${targetRole} role.`
      )
    }
  }

  recommendations.push('Use quantified impact statements (metrics, percentages, outcomes) in each key bullet point.')
  recommendations.push('Move your most relevant achievements and tech stack details closer to the top of the resume.')

  return [...new Set(recommendations)].slice(0, 6)
}

export async function analyzeResumeText({ resumeText, jobDescription, targetRole }) {
  const scoring = scoreResume(resumeText, jobDescription)

  const extractedSkills = extractSkillsFromText(resumeText)
  const roleSkills = extractSkillsFromText(jobDescription)
  const matchedRoleSkills = roleSkills.filter((skill) => extractedSkills.includes(skill))

  const skillCoverageScore = roleSkills.length
    ? Math.round((matchedRoleSkills.length / roleSkills.length) * 100)
    : extractedSkills.length
      ? 60
      : 20

  const overallScore = Math.round(scoring.atsScore * 0.7 + skillCoverageScore * 0.3)

  let strengths = buildStrengths({
    atsScore: scoring.atsScore,
    matchedKeywords: scoring.matchedKeywords,
    extractedSkills,
  })

  let weaknesses = buildWeaknesses({
    atsScore: scoring.atsScore,
    missingKeywords: scoring.missingKeywords,
    extractedSkills,
  })

  let summary = `ATS score ${scoring.atsScore} with ${scoring.matchedKeywords.length} matched keywords and ${scoring.missingKeywords.length} missing keywords.`

  let recommendations = buildRecommendations({
    targetRole,
    missingKeywords: scoring.missingKeywords,
    extractedSkills,
    roleSkills,
  })

  const aiAnalysis = await generateAnalysisWithGroq({
    resumeText,
    jobDescription,
    targetRole,
    analysisSnapshot: {
      overallScore,
      atsScore: scoring.atsScore,
      matchedKeywords: scoring.matchedKeywords,
      missingKeywords: scoring.missingKeywords,
      topJobKeywords: extractKeywordsFromJobDescription(jobDescription, 10),
    },
  })

  if (aiAnalysis) {
    if (aiAnalysis.summary) {
      summary = aiAnalysis.summary
    }
    if (aiAnalysis.strengths.length) {
      strengths = aiAnalysis.strengths
    }
    if (aiAnalysis.weaknesses.length) {
      weaknesses = aiAnalysis.weaknesses
    }
    if (aiAnalysis.recommendations.length) {
      recommendations = aiAnalysis.recommendations
    }
  } else {
    const error = new Error('AI analysis failed. Groq is unavailable or returned invalid output.')
    error.status = 502
    throw error
  }

  return {
    overallScore,
    atsScore: scoring.atsScore,
    summary,
    matchedKeywords: scoring.matchedKeywords,
    missingKeywords: scoring.missingKeywords,
    extractedSkills,
    strengths,
    weaknesses,
    recommendations,
    targetRole,
  }
}

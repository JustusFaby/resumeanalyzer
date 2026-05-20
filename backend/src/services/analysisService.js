import { generateAnalysisWithGroq } from './groqService.js'

export async function analyzeResumeText({ resumeText, jobDescription, targetRole }) {
  const aiAnalysis = await generateAnalysisWithGroq({
    resumeText,
    jobDescription,
    targetRole,
  })

  if (!aiAnalysis) {
    const error = new Error('AI analysis failed. Groq is unavailable or returned invalid output.')
    error.status = 502
    throw error
  }

  return {
    overallScore: aiAnalysis.overallScore,
    atsScore: aiAnalysis.atsScore,
    summary: aiAnalysis.summary,
    matchedKeywords: aiAnalysis.matchedKeywords,
    missingKeywords: aiAnalysis.missingKeywords,
    extractedSkills: aiAnalysis.extractedSkills,
    strengths: aiAnalysis.strengths,
    weaknesses: aiAnalysis.weaknesses,
    recommendations: aiAnalysis.recommendations,
    targetRole,
  }
}

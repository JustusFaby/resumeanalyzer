'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getAuthHeader } from './auth'

export interface AnalysisResult {
  id: string
  fileName: string
  uploadDate: string
  overallScore?: number
  atsScore: number
  summary?: string
  matchedKeywords: string[]
  missingKeywords: string[]
  extractedSkills: string[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  jobDescription?: string
  targetRole?: string
}

interface ResumeContextType {
  analyses: AnalysisResult[]
  currentAnalysis: AnalysisResult | null
  addAnalysis: (analysis: AnalysisResult) => void
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void
  deleteAnalysis: (id: string) => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const loadReports = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
        const response = await fetch(`${apiBaseUrl}/api/resumes`, {
          headers: {
            ...getAuthHeader(),
          },
        })
        if (!response.ok) {
          return
        }

        const payload = await response.json()
        const reports = Array.isArray(payload.reports) ? payload.reports : []

        setAnalyses(
          reports.map((report: AnalysisResult & { reportId?: string }) => ({
            id: report.reportId || report.id,
            fileName: report.fileName || 'resume.pdf',
            uploadDate: report.createdAt || report.uploadDate || new Date().toISOString(),
            overallScore: report.overallScore,
            atsScore: report.atsScore,
            summary: report.summary,
            matchedKeywords: report.matchedKeywords || [],
            missingKeywords: report.missingKeywords || [],
            extractedSkills: report.extractedSkills || [],
            strengths: report.strengths || [],
            weaknesses: report.weaknesses || [],
            recommendations: report.recommendations || [],
            jobDescription: report.jobDescription,
            targetRole: report.targetRole,
          }))
        )
      } catch (_error) {
        // Ignore load errors for now; local state still works.
      }
    }

    loadReports()
  }, [])

  const addAnalysis = (analysis: AnalysisResult) => {
    setAnalyses((prev) => [analysis, ...prev])
    setCurrentAnalysis(analysis)
  }

  const deleteAnalysis = (id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null)
    }
  }

  return (
    <ResumeContext.Provider
      value={{
        analyses,
        currentAnalysis,
        addAnalysis,
        setCurrentAnalysis,
        deleteAnalysis,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider')
  }
  return context
}

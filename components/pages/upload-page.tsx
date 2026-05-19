'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadBox } from '@/components/shared/upload-box'
import { useResume } from '@/lib/context'
import { getAuthHeader } from '@/lib/auth'

export function UploadPage() {
  const navigate = useNavigate()
  const { addAnalysis } = useResume()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!selectedFile) return
    if (!targetRole.trim()) {
      setError('Target role is required to run analysis.')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)
      formData.append('jobDescription', jobDescription)
      formData.append('targetRole', targetRole.trim())

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiBaseUrl}/api/resumes/analyze`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Failed to analyze resume.')
      }

      const report = await response.json()

      addAnalysis({
        id: report.reportId || Date.now().toString(),
        fileName: selectedFile.name,
        uploadDate: report.createdAt || new Date().toISOString(),
        overallScore: report.overallScore,
        atsScore: report.atsScore,
        summary: report.summary,
        matchedKeywords: report.matchedKeywords || [],
        missingKeywords: report.missingKeywords || [],
        extractedSkills: report.extractedSkills || [],
        strengths: report.strengths || [],
        weaknesses: report.weaknesses || [],
        recommendations: report.recommendations || [],
        jobDescription,
        targetRole: report.targetRole || targetRole.trim(),
      })

      navigate('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl mb-2">Analyze Your Resume</h1>
          <p className="text-muted-foreground">Upload your resume and role context to get focused, AI-powered insights.</p>
        </div>

        <div className="grid gap-8">
          {/* Resume Upload */}
          <Card className="border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>PDF, DOC, or DOCX format (max 10MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <UploadBox onFileSelect={setSelectedFile} />
              {selectedFile && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Selected: <span className="font-semibold">{selectedFile.name}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Role */}
          <Card className="border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Target Role</CardTitle>
              <CardDescription>Specify the role you are applying for</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Frontend Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Job Description (Optional)</CardTitle>
              <CardDescription>Paste the job description to compare against your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here to get role-specific recommendations..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-48"
              />
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="flex-1"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

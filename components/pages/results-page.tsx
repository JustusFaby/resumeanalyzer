'use client'

import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreCard } from '@/components/cards/score-card'
import { SkillsTags } from '@/components/shared/skills-tags'
import { EmptyState } from '@/components/shared/empty-state'
import { useResume } from '@/lib/context'

export function ResultsPage() {
  const navigate = useNavigate()
  const { currentAnalysis } = useResume()

  if (!currentAnalysis) {
    return (
      <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <EmptyState
            title="No Analysis Found"
            description="Please upload a resume to get analysis results"
            actionLabel="Upload Resume"
            onAction={() => navigate('/upload')}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="font-display text-3xl sm:text-4xl mb-2">Resume Analysis</h1>
            <p className="text-muted-foreground">{currentAnalysis.fileName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Score */}
        <div className="mb-8">
          <ScoreCard
            score={currentAnalysis.atsScore}
            label="ATS Score"
            max={100}
            description="How well your resume passes ATS systems"
            color={currentAnalysis.atsScore >= 80 ? 'success' : currentAnalysis.atsScore >= 60 ? 'warning' : 'danger'}
          />
        </div>

        {currentAnalysis.summary && (
          <Card className="mb-8 border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{currentAnalysis.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        <Card className="mb-8 border-border/70 bg-card/75 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Extracted Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillsTags skills={currentAnalysis.extractedSkills} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {currentAnalysis.strengths.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Weaknesses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {currentAnalysis.weaknesses.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-border/70 bg-card/75 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {currentAnalysis.recommendations.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Matched Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsTags skills={currentAnalysis.matchedKeywords} />
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/75 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Missing Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsTags skills={currentAnalysis.missingKeywords} />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Button onClick={() => navigate('/upload')} className="gap-2">
            Analyze Another Resume
          </Button>
          <Button variant="outline" onClick={() => navigate('/history')}>
            View History
          </Button>
        </div>
      </div>
    </main>
  )
}

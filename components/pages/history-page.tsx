'use client'

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Trash2, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SkillsTags } from '@/components/shared/skills-tags'
import { EmptyState } from '@/components/shared/empty-state'
import { useResume } from '@/lib/context'

export function HistoryPage() {
  const navigate = useNavigate()
  const { analyses, setCurrentAnalysis, deleteAnalysis } = useResume()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')

  const filteredAnalyses = useMemo(() => {
    let results = analyses.filter((analysis) =>
      analysis.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.targetRole?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (sortBy === 'date') {
      results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    } else {
      results.sort((a, b) => b.atsScore - a.atsScore)
    }

    return results
  }, [analyses, searchQuery, sortBy])

  const handleViewAnalysis = (analysis: typeof analyses[0]) => {
    setCurrentAnalysis(analysis)
    navigate('/results')
  }

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl mb-2">Resume History</h1>
          <p className="text-muted-foreground">Track and manage all your resume analyses</p>
        </div>

        {analyses.length > 0 ? (
          <>
            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by file name or job description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={sortBy === 'date' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('date')}
                >
                  Sort by Date
                </Button>
                <Button
                  variant={sortBy === 'score' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('score')}
                >
                  Sort by Score
                </Button>
              </div>
            </div>

            {/* Results Table */}
            {filteredAnalyses.length > 0 ? (
              <div className="space-y-4">
                {filteredAnalyses.map((analysis) => (
                  <Card
                    key={analysis.id}
                    className="cursor-pointer border-border/70 bg-card/75 p-6 transition hover:-translate-y-0.5 hover:bg-muted/50"
                    onClick={() => handleViewAnalysis(analysis)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                      {/* File Info */}
                      <div>
                        <p className="font-semibold text-foreground mb-1">{analysis.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.uploadDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* ATS Score */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">ATS Score</p>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-primary">{analysis.atsScore}</span>
                          <span className="text-xs text-muted-foreground mb-1">/100</span>
                        </div>
                      </div>

                      {/* Skills Preview */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Skills Found</p>
                        <SkillsTags skills={analysis.extractedSkills.slice(0, 3)} maxDisplay={2} compact />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewAnalysis(analysis)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteAnalysis(analysis.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="No Results Found" description="Try adjusting your search query" />
            )}
          </>
        ) : (
          <EmptyState
            title="No Resume Analyses Yet"
            description="Start by uploading and analyzing your resume to see your history"
            actionLabel="Analyze Resume"
            onAction={() => navigate('/upload')}
          />
        )}
      </div>
    </main>
  )
}

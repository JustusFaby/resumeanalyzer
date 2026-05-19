import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Lightbulb } from 'lucide-react'

interface SectionAnalysisCardProps {
  sections: Array<{ name: string; quality: number; suggestions: string[] }>
}

export function SectionAnalysisCard({ sections }: SectionAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.name} className={index !== sections.length - 1 ? 'pb-4 border-b border-border' : ''}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{section.name}</h4>
                <span className="text-sm font-semibold text-primary">{section.quality}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${section.quality * 10}%` }}
                />
              </div>
              <div className="space-y-2">
                {section.suggestions.map((suggestion) => (
                  <div key={suggestion} className="flex gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

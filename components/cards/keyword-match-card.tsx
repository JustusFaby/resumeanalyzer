import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

interface KeywordMatchCardProps {
  keywords: Array<{ word: string; found: boolean; frequency: number }>
}

export function KeywordMatchCard({ keywords }: KeywordMatchCardProps) {
  const foundKeywords = keywords.filter((k) => k.found)
  const matchPercentage = Math.round((foundKeywords.length / keywords.length) * 100)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Keyword Matching</span>
          <span className="text-2xl font-bold text-primary">{matchPercentage}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {keywords.map((keyword) => (
            <div key={keyword.word} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
              <div className="flex items-center gap-3 flex-1">
                {keyword.found ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${keyword.found ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {keyword.word}
                </span>
              </div>
              {keyword.found && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                  {keyword.frequency}x
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

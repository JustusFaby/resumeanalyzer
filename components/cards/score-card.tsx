import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ScoreCardProps {
  score: number
  label: string
  max?: number
  description?: string
  color?: 'success' | 'warning' | 'danger'
}

export function ScoreCard({ score, label, max = 100, description, color = 'success' }: ScoreCardProps) {
  const percentage = (score / max) * 100
  const colorClass = color === 'success' ? 'text-green-600' : color === 'warning' ? 'text-yellow-600' : 'text-red-600'
  const bgColorClass = color === 'success' ? 'bg-green-100 dark:bg-green-900/30' : color === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${percentage * 2.83} 283`}
                className={colorClass}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${colorClass}`}>{score}</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold">{percentage.toFixed(0)}%</p>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

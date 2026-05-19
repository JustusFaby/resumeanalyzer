import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkillsTags } from '@/components/shared/skills-tags'

interface RoleMatchCardProps {
  roleMatches: Array<{ role: string; matchPercentage: number; keywords: string[] }>
}

export function RoleMatchCard({ roleMatches }: RoleMatchCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roleMatches.map((role, index) => (
            <div key={role.role} className={index !== roleMatches.length - 1 ? 'pb-4 border-b border-border' : ''}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{role.role}</h4>
                <span className="text-lg font-bold text-primary">{role.matchPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${role.matchPercentage}%` }}
                />
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Key Skills Match:</p>
                <SkillsTags skills={role.keywords} compact />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Badge } from '@/components/ui/badge'

interface SkillsTagsProps {
  skills: string[]
  maxDisplay?: number
  compact?: boolean
}

export function SkillsTags({ skills, maxDisplay, compact = false }: SkillsTagsProps) {
  const displayedSkills = maxDisplay ? skills.slice(0, maxDisplay) : skills
  const remainingCount = maxDisplay && skills.length > maxDisplay ? skills.length - maxDisplay : 0

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : ''}`}>
      {displayedSkills.map((skill) => (
        <Badge key={skill} variant="secondary" className={compact ? 'text-xs' : ''}>
          {skill}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className={compact ? 'text-xs' : ''}>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  )
}

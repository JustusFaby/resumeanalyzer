'use client'

import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  Target,
  WandSparkles,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'ATS Scoring',
      description: 'Get an instant ATS score to see how well your resume passes through applicant tracking systems.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Keyword Matching',
      description: 'Identify missing keywords and see which job descriptions match your skills best.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Role Matching',
      description: 'Discover job roles that align with your experience and get suggestions for improvement.',
    },
    {
      icon: <FileSearch className="w-6 h-6" />,
      title: 'Section Diagnostics',
      description: 'See exactly which sections are underperforming and what to rewrite first.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Hiring-Safe Language',
      description: 'Get suggestions tuned for clarity, confidence, and recruiter readability.',
    },
    {
      icon: <WandSparkles className="w-6 h-6" />,
      title: 'Smart Rewrite Prompts',
      description: 'Generate better bullet points based on your current resume context and goals.',
    },
  ]

  const benefits = [
    'Upload in under 60 seconds',
    'Get immediate ATS diagnostics',
    'Compare multiple resume drafts',
    'Tailor to each job posting',
    'Track score movement over time',
    'Apply with more confidence',
  ]

  const impactStats = [
    { label: 'Average ATS Lift', value: '+28%' },
    { label: 'Time to First Insight', value: '45 sec' },
    { label: 'Sections Evaluated', value: '8+' },
  ]

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center animate-rise">
            <p className="inline-flex items-center rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-xs font-medium tracking-[0.14em] text-muted-foreground">
              BUILT FOR AMBITIOUS JOB SEEKERS
            </p>

            <div className="space-y-6">
              <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Make Every Resume Feel
                <span className="block text-primary">Role-Specific and Interview-Ready.</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
                IntelliResume turns vague resume feedback into measurable improvements: ATS score, keyword match,
                role fit, and section-level rewrite guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/upload">
                <Button size="lg" className="gap-2 px-8 py-6 text-base">
                  Start Analyzing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/history">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  See Past Reports
                </Button>
              </Link>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
              {impactStats.map((item) => (
                <Card key={item.label} className="border-border/70 bg-card/75 p-5 text-left shadow-lg shadow-primary/5">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</p>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl">A Sharper Workflow From Draft to Offer</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Focus on impact, not formatting guesswork. Every module is built to make your next version stronger.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/70 bg-card/75 p-6 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/10 px-6 py-14 text-center shadow-xl shadow-primary/10 sm:px-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Ready to Outperform Generic Applications?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Upload your resume, match it against the role, and get practical improvements in minutes.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/upload">
              <Button size="lg" className="gap-2 px-8 py-6 text-base">
                Upload Your Resume <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

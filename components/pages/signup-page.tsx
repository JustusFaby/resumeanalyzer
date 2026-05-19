'use client'

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { loginWithCognito } from '@/lib/auth'

export function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-35" />
      <Card className="relative w-full max-w-md border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/logo.png" alt="IntelliResume" width={48} height={48} className="rounded-xl ring-1 ring-primary/30" />
          </div>
          <div>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Create an account and track your resume performance</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button type="button" className="w-full" onClick={loginWithCognito}>
              Continue with Cognito
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

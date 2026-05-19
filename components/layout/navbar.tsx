'use client'

import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Moon, Sparkles, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { loginWithCognito } from '@/lib/auth'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Analyze', to: '/upload' },
  { label: 'History', to: '/history' },
]

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, logout, isLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/logo.png"
            alt="IntelliResume"
            width={34}
            height={34}
            className="rounded-lg ring-1 ring-primary/30 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <p className="text-base font-semibold tracking-tight">IntelliResume</p>
            <p className="text-xs text-muted-foreground">Career signal, quantified</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-card/70 p-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!isLoading && isAuthenticated ? (
            <>
              <span className="hidden sm:inline-flex text-xs text-muted-foreground">
                {user?.email || 'Signed in'}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={loginWithCognito}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="hidden md:inline-flex gap-1.5"
                onClick={loginWithCognito}
              >
                <Sparkles className="h-4 w-4" />
                Start Free
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}

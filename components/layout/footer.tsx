import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border/60 bg-card/40 py-10 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold tracking-tight text-foreground">IntelliResume</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              AI-powered scorecards that help you tune each resume for the role you actually want.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-foreground">
                  Home <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/upload" className="inline-flex items-center gap-1.5 transition hover:text-foreground">
                  Analyze Resume <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/history" className="inline-flex items-center gap-1.5 transition hover:text-foreground">
                  View History <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="transition hover:text-foreground">About</a></li>
              <li><a href="#" className="transition hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="transition hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-8">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 IntelliResume. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="transition hover:text-foreground">Privacy</a>
            <a href="#" className="transition hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

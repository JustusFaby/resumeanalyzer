import { Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { LandingPage } from '@/components/pages/landing-page'
import { UploadPage } from '@/components/pages/upload-page'
import { ResultsPage } from '@/components/pages/results-page'
import { HistoryPage } from '@/components/pages/history-page'
import { LoginPage } from '@/components/pages/login-page'
import { SignupPage } from '@/components/pages/signup-page'
import { ResumeProvider } from '@/lib/context'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ResumeProvider>
        <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
          <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
            <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[110px]" />
            <div className="absolute right-[-10rem] top-[16rem] h-[24rem] w-[24rem] rounded-full bg-chart-2/20 blur-[110px]" />
            <div className="absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-chart-1/20 blur-[120px]" />
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <LandingPage />
                </MainLayout>
              }
            />
            <Route
              path="/upload"
              element={
                <MainLayout>
                  <UploadPage />
                </MainLayout>
              }
            />
            <Route
              path="/results"
              element={
                <MainLayout>
                  <ResultsPage />
                </MainLayout>
              }
            />
            <Route
              path="/history"
              element={
                <MainLayout>
                  <HistoryPage />
                </MainLayout>
              }
            />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<Navigate to="/signin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ResumeProvider>
    </ThemeProvider>
  )
}

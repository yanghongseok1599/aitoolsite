import { DashboardHeader } from '@/components/DashboardHeader'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { CTA } from '@/components/CTA'
import { Footer } from '@/components/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <DashboardHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}

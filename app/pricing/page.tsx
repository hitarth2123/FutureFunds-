"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export default function PricingPage() {
  const mutualMarketHref = process.env.NEXT_PUBLIC_MUTUAL_MARKET_URL || "/mutual-market"
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-serif">FutureFunds</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">Calculator</Link>
            <Link href="/schemes" className="text-sm font-medium hover:text-primary transition-colors">Schemes</Link>
            <Link href="/pricing" className="text-sm font-medium text-primary">Pricing</Link>
            <Link href={mutualMarketHref} className="text-sm font-medium hover:text-primary transition-colors">Mutual Market</Link>
          </nav>
          <UserNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">India Market</Badge>
          <h1 className="text-4xl font-bold font-serif mb-3">Simple, transparent pricing</h1>
          <p className="text-muted-foreground">Start free. Upgrade when you want ongoing guidance, tax optimization, and deeper insights.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">Free <Badge>Freemium</Badge></CardTitle>
              <CardDescription>Get started with core retirement planning for India</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div><span className="text-3xl font-semibold">₹0</span> <span className="text-muted-foreground">/ forever</span></div>
              <ul className="space-y-2 list-disc pl-5">
                <li>Basic calculator (EPF, PPF, NPS, mutual funds)</li>
                <li>One-time corpus projection</li>
                <li>Inflation-adjusted results</li>
                <li>5 calculations/month</li>
                <li>PDF report download</li>
              </ul>
              <Link href="/calculator" className="mt-4">
                <Button className="w-full">Start Free</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative border-primary/40">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="default">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle>RetireRight Pro</CardTitle>
              <CardDescription>Everything in Free, plus scenario modeling and tracking</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-end gap-2">
                <div className="text-3xl font-semibold">₹499</div>
                <div className="text-muted-foreground">/ month</div>
              </div>
              <div className="text-muted-foreground">or ₹4,999 / year (save 17%)</div>
              <ul className="space-y-2 list-disc pl-5">
                <li>Unlimited calculations & scenario modeling</li>
                <li>Monthly progress tracking & notifications</li>
                <li>Tax optimization (80C, 80CCD(1B), 80D)</li>
                <li>Healthcare corpus (medical inflation at 14%)</li>
                <li>Goal milestones & peer comparisons</li>
                <li>2 CFP video consults/year</li>
              </ul>
              <Link href="/auth" className="mt-2">
                <Button className="w-full">Go Pro</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Corporate RetireRight</CardTitle>
              <CardDescription>For HR teams to improve employee retirement readiness</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div><span className="text-3xl font-semibold">₹50,000–₹5,00,000</span> <span className="text-muted-foreground">/ year</span></div>
              <ul className="space-y-2 list-disc pl-5">
                <li>White-labeled onboarding & branding</li>
                <li>Bulk licenses (100–10,000 employees)</li>
                <li>Quarterly retirement wellness webinars</li>
                <li>Anonymous employee readiness analytics</li>
                <li>Priority support & dedicated success manager</li>
              </ul>
              <Link href="mailto:sales@futurefunds.app" className="mt-4">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6 text-sm">
          <Card>
            <CardHeader>
              <CardTitle>Why Pro?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>Traditional advisors charge ₹50,000–₹2,00,000/year. Pro offers 90–97% savings with clear, unbiased guidance.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>India-first design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>Built for EPF/PPF/NPS, Indian inflation, Section 80C, and more. Regional languages coming soon.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancel anytime</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>No lock‑in. Upgrade and downgrade anytime to match your journey.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}



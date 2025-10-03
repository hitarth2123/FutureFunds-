import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import { Calculator, TrendingUp, Shield, PiggyBank } from "lucide-react"

export default function HomePage() {
  const mutualMarketHref = process.env.NEXT_PUBLIC_MUTUAL_MARKET_URL || "/mutual-market"
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-serif">FutureFunds</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link href="/schemes" className="text-sm font-medium hover:text-primary transition-colors">
              Schemes
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href={mutualMarketHref} className="text-sm font-medium hover:text-primary transition-colors">
              Mutual Market
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
          </nav>
          <UserNav />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
              FutureFunds
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Plan Your Retirement with Mutual Funds, FD/RD & Government Schemes
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take control of your financial future with our comprehensive retirement planning calculator. Get
              personalized projections and make informed investment decisions.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/calculator">
                <Button size="lg" className="text-lg">
                  <Calculator className="mr-2 h-5 w-5" />
                  Start Planning
                </Button>
              </Link>
              <Link href="/schemes">
                <Button size="lg" variant="outline" className="text-lg bg-transparent">
                  View Schemes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-[family-name:var(--font-playfair)]">
            Why Choose FutureFunds?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Calculator className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced algorithms to calculate your retirement corpus with multiple investment options including
                  SIP, FD, RD, and government schemes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Growth Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualize your wealth growth over time with detailed year-by-year projections and interactive charts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Government Schemes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access information about NPS, PPF, SCSS, and other Indian government schemes with current interest
                  rates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <PiggyBank className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Multiple Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Save and compare different retirement scenarios to find the best investment strategy for your goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)]">
            Ready to Secure Your Future?
          </h2>
          <p className="text-lg opacity-90">
            Start planning your retirement today with our free calculator. No registration required to get started.
          </p>
          <Link href="/calculator">
            <Button size="lg" variant="secondary" className="text-lg">
              Calculate Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>&copy; 2025 FutureFunds. Plan your retirement with confidence.</p>
        </div>
      </footer>
    </div>
  )
}

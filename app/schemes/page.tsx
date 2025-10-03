import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { indianSchemes, fdRates } from "@/lib/schemes"
import { Calculator, TrendingUp, Shield, PiggyBank, IndianRupee, Lock, Award, ExternalLink } from "lucide-react"

export default function SchemesPage() {
  const mutualMarketHref = process.env.NEXT_PUBLIC_MUTUAL_MARKET_URL || "/mutual-market"
  const pensionSchemes = indianSchemes.filter((s) => s.type === "pension")
  const savingsSchemes = indianSchemes.filter((s) => s.type === "savings")
  const taxSavingSchemes = indianSchemes.filter((s) => s.type === "tax-saving")
  const fixedIncomeSchemes = indianSchemes.filter((s) => s.type === "fixed-income")

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
    return `₹${value}`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pension":
        return <PiggyBank className="h-5 w-5" />
      case "savings":
        return <TrendingUp className="h-5 w-5" />
      case "tax-saving":
        return <Shield className="h-5 w-5" />
      case "fixed-income":
        return <IndianRupee className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "pension":
        return "default"
      case "savings":
        return "secondary"
      case "tax-saving":
        return "outline"
      default:
        return "default"
    }
  }

  const getSchemeUrl = (schemeId: string) => {
    const urls: Record<string, string> = {
      nps: "https://www.npscra.nsdl.co.in/",
      atal: "https://www.npscra.nsdl.co.in/scheme-details.php",
      ppf: "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx",
      scss: "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx",
      pmvvy: "https://licindia.in/Products/Pension-Plans/Pradhan-Mantri-Vaya-Vandana-Yojana",
      nsc: "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx",
      kvp: "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx",
      elss: "https://www.amfiindia.com/",
      sgb: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
    }
    return urls[schemeId] || "https://www.india.gov.in/"
  }

  const SchemeCard = ({ scheme }: { scheme: (typeof indianSchemes)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTypeIcon(scheme.type)}
            <Badge variant={getTypeBadgeVariant(scheme.type)}>{scheme.type.replace("-", " ")}</Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{scheme.interestRate}%</p>
            <p className="text-xs text-muted-foreground">p.a.</p>
          </div>
        </div>
        <CardTitle className="text-xl">{scheme.name}</CardTitle>
        <CardDescription>{scheme.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Investment Range</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(scheme.minInvestment)}
                {scheme.maxInvestment ? ` - ${formatCurrency(scheme.maxInvestment)}` : " onwards"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Lock-in Period</p>
              <p className="text-sm text-muted-foreground">
                {scheme.lockInPeriod === 0 ? "Until retirement" : `${scheme.lockInPeriod} years`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Tax Benefit</p>
              <p className="text-sm text-muted-foreground">{scheme.taxBenefit}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Eligibility</p>
              <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
            </div>
          </div>
        </div>

        <Button asChild className="w-full bg-transparent" variant="outline">
          <a href={getSchemeUrl(scheme.id)} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Official Portal
          </a>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
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
            <Link href="/schemes" className="text-sm font-medium text-primary">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif">Government Schemes & Investment Options</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore various Indian government schemes and investment options for retirement planning. Compare interest
              rates, tax benefits, and eligibility criteria.
            </p>
          </div>

          {/* Schemes Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="all">All Schemes</TabsTrigger>
              <TabsTrigger value="pension">Pension</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="tax-saving">Tax Saving</TabsTrigger>
              <TabsTrigger value="fixed-income">Fixed Income</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {indianSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pension" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pensionSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="savings" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savingsSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tax-saving" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {taxSavingSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fixed-income" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fixedIncomeSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Bank FD Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Bank Fixed Deposit Rates</CardTitle>
              <CardDescription>Current FD interest rates from major Indian banks (indicative)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Bank</th>
                      <th className="text-center py-3 px-4 font-semibold">1 Year</th>
                      <th className="text-center py-3 px-4 font-semibold">2 Years</th>
                      <th className="text-center py-3 px-4 font-semibold">3 Years</th>
                      <th className="text-center py-3 px-4 font-semibold">5 Years</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(fdRates).map(([bank, rates]) => (
                      <tr key={bank} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium uppercase">{bank}</td>
                        <td className="text-center py-3 px-4">{rates["1year"]}%</td>
                        <td className="text-center py-3 px-4">{rates["2year"]}%</td>
                        <td className="text-center py-3 px-4">{rates["3year"]}%</td>
                        <td className="text-center py-3 px-4">{rates["5year"]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Note: Interest rates are subject to change. Please verify with respective banks for current rates.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif">Ready to Plan Your Retirement?</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Use our calculator to see how these schemes can help you achieve your retirement goals
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/calculator">
                <Button size="lg" variant="secondary">
                  <Calculator className="mr-2 h-5 w-5" />
                  Start Calculating
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

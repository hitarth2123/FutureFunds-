"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCurrentUser, signOutWithFirebase, onAuthStateChange, type User } from "@/lib/auth"
import { LayoutDashboard, Calculator, FileText, BookOpen, Settings, LogOut } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    const unsubscribe = onAuthStateChange((u) => setUser(u))
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOutWithFirebase()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={() => router.push("/auth")}>
        Sign In
      </Button>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback className="bg-emerald-600 text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/scenarios")}>
          <FileText className="mr-2 h-4 w-4" />
          My Scenarios
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/calculator")}>
          <Calculator className="mr-2 h-4 w-4" />
          Calculator
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/schemes")}>
          <BookOpen className="mr-2 h-4 w-4" />
          Schemes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

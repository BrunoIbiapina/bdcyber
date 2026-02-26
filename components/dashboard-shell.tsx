"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileText,
  ShieldCheck,
  Settings,
  Menu,
  Moon,
  Sun,
  ChevronRight,
  Activity,
  Shield,
  Bell,
  User,
  LogOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { href: "/", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/exploracao", label: "Exploração", icon: Search },
  { href: "/detalhes", label: "Detalhes", icon: FileText },
  { href: "/qualidade", label: "Qualidade", icon: ShieldCheck },
]

const settingsItem = { href: "/config", label: "Configurações", icon: Settings }

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary/20 border border-sidebar-primary/30 shadow-[0_0_12px_0_rgba(99,102,241,0.3)]">
            <Shield className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground leading-none">DataDash</span>
            <span className="text-[10px] text-sidebar-muted-foreground leading-none mt-0.5">Security Monitor</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4" aria-label="Menu principal">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted-foreground">
          Monitoramento
        </p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 inset-y-1 w-0.5 rounded-r-full bg-sidebar-primary" />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-6">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted-foreground">
            Sistema
          </p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link
                href={settingsItem.href}
                onClick={onNavigate}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
                  pathname === settingsItem.href
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                aria-current={pathname === settingsItem.href ? "page" : undefined}
              >
                {pathname === settingsItem.href && (
                  <span className="absolute left-0 inset-y-1 w-0.5 rounded-r-full bg-sidebar-primary" />
                )}
                <settingsItem.icon className="h-4 w-4 shrink-0" />
                {settingsItem.label}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-sidebar-primary/20 border border-sidebar-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-sidebar-primary">AD</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-sidebar-foreground truncate">Admin</span>
            <span className="text-[10px] text-sidebar-muted-foreground truncate">admin@datadash</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const current = [...navItems, settingsItem].find((i) => i.href === pathname) || navItems[0]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-56 p-0 bg-sidebar border-r border-sidebar-border">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/50 backdrop-blur-sm px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">DataDash</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span className="font-medium text-foreground">{current.label}</span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Alternar tema"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-1" aria-label="Menu do usuário">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

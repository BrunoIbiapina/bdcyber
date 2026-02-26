"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileText,
  ShieldCheck,
  Settings,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const pages = [
  { href: "/", label: "Visao Geral", icon: LayoutDashboard },
  { href: "/exploracao", label: "Exploracao", icon: Search },
  { href: "/detalhes", label: "Detalhes", icon: FileText },
  { href: "/qualidade", label: "Qualidade de Dados", icon: ShieldCheck },
  { href: "/config", label: "Configuracoes", icon: Settings },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  function navigate(href: string) {
    router.push(href)
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Paleta de Comandos" description="Navegue rapidamente entre paginas">
      <CommandInput placeholder="Buscar pagina..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Paginas">
          {pages.map((page) => (
            <CommandItem key={page.href} onSelect={() => navigate(page.href)}>
              <page.icon className="mr-2 h-4 w-4" />
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

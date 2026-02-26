"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Bell, Shield, Database, Palette, Save, RotateCcw } from "lucide-react"

export default function ConfigPage() {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Configuracoes</h1>
            <p className="text-sm text-muted-foreground">Gerencie as preferencias do dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Resetar
            </Button>
            <Button size="sm" className="text-xs" onClick={handleSave}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {saved ? "Salvo!" : "Salvar"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Aparencia</CardTitle>
              </div>
              <CardDescription className="text-xs">Personalize a interface visual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Layout compacto</Label>
                  <p className="text-xs text-muted-foreground">Reduz o espacamento entre elementos</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Animacoes</Label>
                  <p className="text-xs text-muted-foreground">Habilita transicoes e animacoes</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Notificacoes</CardTitle>
              </div>
              <CardDescription className="text-xs">Configure alertas e notificacoes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Alertas por email</Label>
                  <p className="text-xs text-muted-foreground">Receba alertas criticos por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Notificacoes push</Label>
                  <p className="text-xs text-muted-foreground">Alertas em tempo real no navegador</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm">Limite de severidade</Label>
                <Select defaultValue="high">
                  <SelectTrigger className="h-8 w-full text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-xs">Low</SelectItem>
                    <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                    <SelectItem value="high" className="text-xs">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Seguranca</CardTitle>
              </div>
              <CardDescription className="text-xs">Configuracoes de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Autenticacao dois fatores</Label>
                  <p className="text-xs text-muted-foreground">Camada extra de seguranca</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm">Timeout de sessao</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="h-8 w-full text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15" className="text-xs">15 minutos</SelectItem>
                    <SelectItem value="30" className="text-xs">30 minutos</SelectItem>
                    <SelectItem value="60" className="text-xs">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Dados</CardTitle>
              </div>
              <CardDescription className="text-xs">Gerenciamento de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Intervalo de atualizacao</Label>
                <Select defaultValue="30s">
                  <SelectTrigger className="h-8 w-full text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10s" className="text-xs">10 segundos</SelectItem>
                    <SelectItem value="30s" className="text-xs">30 segundos</SelectItem>
                    <SelectItem value="60s" className="text-xs">1 minuto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm">Endpoint da API</Label>
                <Input defaultValue="https://api.datadash.io/v1" className="h-8 text-xs font-mono" readOnly />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

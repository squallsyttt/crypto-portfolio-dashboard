'use client'

import { SettingsPanel } from '@/components/settings/settings-panel'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/lib/store/settings-store'
import { RotateCcw } from 'lucide-react'

export default function SettingsPage() {
  const { resetToDefaults } = useSettingsStore()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">设置</h1>
          <p className="text-muted-foreground">个人偏好和应用配置</p>
        </div>
        <Button
          variant="outline"
          onClick={resetToDefaults}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          恢复默认设置
        </Button>
      </div>

      <SettingsPanel />
    </div>
  )
}

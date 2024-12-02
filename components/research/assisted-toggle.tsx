"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface AssistedToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function AssistedToggle({ enabled, onToggle }: AssistedToggleProps) {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch
        id="assisted-mode"
        checked={enabled}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="assisted-mode">Assisted Research</Label>
    </div>
  )
}
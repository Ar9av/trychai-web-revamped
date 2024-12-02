"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface OutlineEditorProps {
  outline: string
  onOutlineChange: (outline: string) => void
  onConfirm: () => void
}

export function OutlineEditor({ outline, onOutlineChange, onConfirm }: OutlineEditorProps) {
  return (
    <Card className="mt-6 p-6">
      <h3 className="text-lg font-medium mb-4">Generated Outline</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Review and edit the generated outline below. Once you&apos;re satisfied, click Confirm to proceed with the report generation.
      </p>
      <Textarea
        value={outline}
        onChange={(e) => onOutlineChange(e.target.value)}
        className="min-h-[300px] mb-4"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOutlineChange("")}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          <Check className="mr-2 h-4 w-4" />
          Confirm Outline
        </Button>
      </div>
    </Card>
  )
}
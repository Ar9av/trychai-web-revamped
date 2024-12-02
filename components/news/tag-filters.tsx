"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import { toast } from "@/components/ui/use-toast"

interface TagFiltersProps {
  tags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  onTagRemove: (tag: string) => void
  onTagAdd: (tag: string) => void
}

export function TagFilters({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onTagAdd,
}: TagFiltersProps) {
  const [newTag, setNewTag] = useState("")
  const { session } = useClerk()
  const userId = session?.user.id

  const handleAddTag = async () => {
    if (!newTag.trim()) return
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to add tags",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          tag: newTag.trim(),
        }),
      })

      if (!response.ok) throw new Error("Failed to add tag")

      onTagAdd(newTag.trim())
      setNewTag("")
      toast({
        title: "Success",
        description: "Tag added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => 
              selectedTags.includes(tag) ? onTagRemove(tag) : onTagSelect(tag)
            }
          >
            {tag}
            {selectedTags.includes(tag) && (
              <X className="ml-1 h-3 w-3" onClick={(e) => {
                e.stopPropagation()
                onTagRemove(tag)
              }} />
            )}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add new tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
        />
        <Button onClick={handleAddTag}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>
    </div>
  )
}
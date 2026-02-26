'use client'

import { useRef, useState, useTransition } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile, uploadAvatar } from '@/lib/actions/profile'

type ProfileSettingsFormProps = {
  initialFirstName: string | null
  initialAvatarUrl: string | null
  email: string
}

function getInitials(name: string, email: string) {
  const base = name.trim() || email.trim()
  if (!base) return 'U'
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function ProfileSettingsForm({
  initialFirstName,
  initialAvatarUrl,
  email,
}: ProfileSettingsFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadAvatar(file)
      setAvatarUrl(url)
      startTransition(() => updateProfile({ avatar_url: url }))
      toast.success('Avatar updated.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateProfile({ first_name: firstName.trim() || null })
        toast.success('Profile updated.')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Update failed.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="size-24">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={firstName || 'Avatar'} /> : null}
            <AvatarFallback className="text-2xl">{getInitials(firstName, email)}</AvatarFallback>
          </Avatar>
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="text-primary-foreground size-8 animate-spin" />
            ) : (
              <Camera className="text-primary-foreground size-8" />
            )}
          </label>
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-muted-foreground text-sm">Click the avatar to upload a new image.</p>
          <p className="text-muted-foreground text-xs">Images are stored in the avatars bucket.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="first_name">Display name</Label>
        <Input
          id="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Your name"
          className="max-w-md"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}

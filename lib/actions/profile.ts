'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims?.sub) redirect('/auth/login')
  return data.claims.sub as string
}

export async function updateProfile(formData: { first_name?: string | null; avatar_url?: string | null }): Promise<void> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()

  const updates: Record<string, unknown> = {}
  if (formData.first_name !== undefined) updates.first_name = formData.first_name
  if (formData.avatar_url !== undefined) updates.avatar_url = formData.avatar_url

  if (Object.keys(updates).length === 0) return

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
}

export async function uploadAvatar(file: File): Promise<string> {
  const supabase = await createClient()
  const userId = await getAuthenticatedUserId()

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

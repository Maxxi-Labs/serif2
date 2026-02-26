-- Allow blog readers (including anonymous) to view profile names and avatars
create policy "Public can view profiles"
  on public.profiles for select
  using (true);

-- storage: public avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- storage RLS: public read access for avatars
create policy "Public read access for avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- storage RLS: authenticated users can upload to their own folder
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- storage RLS: users can update their own avatars
create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid() = owner);

-- storage RLS: users can delete their own avatars
create policy "Users can delete own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid() = owner);

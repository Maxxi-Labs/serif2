-- Allow public read access to published blogs
drop policy "Users can view own blogs" on public.blogs;

create policy "Public can view published blogs"
  on public.blogs for select
  using (status = 'published' or (auth.uid() = user_id));

-- Allow public read access to profiles (so we can show author info)
drop policy "Users can view own profile" on public.profiles;

create policy "Public can view profiles"
  on public.profiles for select
  using (true);

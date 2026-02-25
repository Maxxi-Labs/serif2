-- blogs table: blog posts authored by users, linked to profiles
create table public.blogs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  summary text,
  body jsonb,
  image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  read_time int not null default 0,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

-- auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_blogs_updated
  before update on public.blogs
  for each row execute procedure public.handle_updated_at();

-- RLS policies: users can only access their own blogs
create policy "Users can view own blogs"
  on public.blogs for select
  using (auth.uid() = user_id);

create policy "Users can create own blogs"
  on public.blogs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own blogs"
  on public.blogs for update
  using (auth.uid() = user_id);

create policy "Users can delete own blogs"
  on public.blogs for delete
  using (auth.uid() = user_id);

-- storage: public blog-images bucket
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- storage RLS: public read access
create policy "Public read access for blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- storage RLS: authenticated users can upload
create policy "Authenticated users can upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

-- storage RLS: users can update their own uploads
create policy "Users can update own blog images"
  on storage.objects for update
  using (bucket_id = 'blog-images' and auth.uid() = owner);

-- storage RLS: users can delete their own uploads
create policy "Users can delete own blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.uid() = owner);

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32 px-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-serif">
            Write your story.
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Serif is a minimal, focused blogging platform designed for writers who
            want to share their ideas without distractions.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Start Writing</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3 md:py-24">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Minimalist Design</h3>
            <p className="text-muted-foreground">
              A clean, distraction-free interface that puts your content first.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Powerful Editor</h3>
            <p className="text-muted-foreground">
              Write with Markdown support and real-time preview.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Audience Growth</h3>
            <p className="text-muted-foreground">
              Built-in tools to help you reach and engage your readers.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Serif. The source code is available on GitHub.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-4 py-20 sm:py-24 md:py-32">
        <h1 className="text-2xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl font-serif">
          The Future of AI Blogging.
        </h1>
        <p className="max-w-[700px] text-sm text-gray-200 sm:text-base md:text-xl">
          Serif is the ultimate platform for AI enthusiasts and developers to share insights, tutorials, and breakthroughs in artificial intelligence.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto bg-white text-black hover:bg-gray-200">
            <Link href="/auth/sign-up">Start Writing</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10 hover:text-white">
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

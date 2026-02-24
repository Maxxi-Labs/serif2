import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  return (
    <nav className={cn("border-b bg-background", transparent && "absolute top-0 z-50 w-full border-none bg-transparent")}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className={cn("flex shrink-0 items-center gap-2 text-2xl font-bold font-serif", transparent && "text-white")}>
          <Image src="/icon.png" alt="Serif" width={32} height={32} className={cn(transparent && "brightness-0 invert")} />
          Serif
        </Link>
        <div className="flex flex-1 items-center justify-center gap-6">
          <Link href="/features" className={cn("text-muted-foreground hover:text-foreground transition-colors", transparent && "text-white/70 hover:text-white")}>
            Feature
          </Link>
          <Link href="/pricing" className={cn("text-muted-foreground hover:text-foreground transition-colors", transparent && "text-white/70 hover:text-white")}>
            Pricing
          </Link>
          <Link href="/blog" className={cn("text-muted-foreground hover:text-foreground transition-colors", transparent && "text-white/70 hover:text-white")}>
            Blog
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Button variant="ghost" asChild className={cn(transparent && "text-white hover:bg-white/10 hover:text-white")}>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild className={cn(transparent && "bg-white text-black hover:bg-white/90")}>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavbarProps {
  transparent?: boolean;
}

const navLinks = [
  { href: "/features", label: "Feature" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function Navbar({ transparent = false }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const linkClass = cn(
    "text-muted-foreground hover:text-foreground transition-colors",
    transparent && "text-white/70 hover:text-white"
  );

  const buttonGhostClass = cn(transparent && "text-white hover:bg-white/10 hover:text-white");
  const buttonPrimaryClass = cn(transparent && "bg-white text-black hover:bg-white/90");

  return (
    <nav className={cn("border-b bg-background", transparent && "absolute top-0 z-50 w-full border-none bg-transparent")}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className={cn("flex shrink-0 items-center gap-2 text-xl font-bold font-serif sm:text-2xl", transparent && "text-white")}>
          <Image src="/icon.png" alt="Serif" width={32} height={32} className={cn(transparent && "brightness-0 invert")} />
          Serif
        </Link>

        {/* Desktop nav - hidden on mobile */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex shrink-0 items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="sm" asChild className={buttonGhostClass}>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button size="sm" asChild className={buttonPrimaryClass}>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", transparent && "text-white hover:bg-white/10 hover:text-white")}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="flex w-[min(300px,100vw-2rem)] flex-col border-l border-border/50 bg-background p-0 shadow-xl"
          >
            <SheetHeader className="flex flex-row items-center justify-between border-b border-border/50 px-5 py-4">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-serif text-lg font-bold">
                <Image src="/icon.png" alt="" width={24} height={24} />
                Serif
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/80 active:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 px-4 pt-4">
                <Button variant="outline" asChild className="h-11 justify-center font-medium">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="h-11 justify-center font-medium">
                  <Link href="/auth/sign-up" onClick={() => setOpen(false)}>Sign up</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

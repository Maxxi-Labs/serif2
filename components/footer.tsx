export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-xs leading-loose text-muted-foreground sm:text-sm md:text-left">
            Built by Serif. The source code is available on GitHub.
          </p>
        </div>
      </div>
    </footer>
  );
}

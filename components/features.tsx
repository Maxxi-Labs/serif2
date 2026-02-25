export function Features() {
  return (
    <section className="container mx-auto grid gap-6 px-4 py-12 sm:gap-8 sm:py-16 md:grid-cols-3 md:py-24">
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
        <h3 className="mb-2 text-lg font-semibold sm:text-xl">AI-Focused Community</h3>
        <p className="text-muted-foreground">
          Connect with like-minded individuals passionate about the latest in AI technology.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
        <h3 className="mb-2 text-lg font-semibold sm:text-xl">Code Syntax Highlighting</h3>
        <p className="text-muted-foreground">
          Share your AI models and scripts with beautiful, language-aware syntax highlighting.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
        <h3 className="mb-2 text-lg font-semibold sm:text-xl">Knowledge Sharing</h3>
        <p className="text-muted-foreground">
          Publish tutorials, research papers, and opinion pieces to a global audience.
        </p>
      </div>
    </section>
  );
}

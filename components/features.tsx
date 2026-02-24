export function Features() {
  return (
    <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3 md:py-24">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-2 text-xl font-semibold">AI-Focused Community</h3>
        <p className="text-muted-foreground">
          Connect with like-minded individuals passionate about the latest in AI technology.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-2 text-xl font-semibold">Code Syntax Highlighting</h3>
        <p className="text-muted-foreground">
          Share your AI models and scripts with beautiful, language-aware syntax highlighting.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-2 text-xl font-semibold">Knowledge Sharing</h3>
        <p className="text-muted-foreground">
          Publish tutorials, research papers, and opinion pieces to a global audience.
        </p>
      </div>
    </section>
  );
}

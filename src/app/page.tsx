import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Genealogical Forest
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              New project starter with Tailwind, shadcn/ui and theme switcher.
            </p>
          </div>
          <ModeToggle />
        </header>

        <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-lg font-medium">Next step</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            I can now scaffold database models for people, albums and photos.
          </p>
          <div className="mt-4">
            <Button>Start DB schema setup</Button>
          </div>
        </section>
      </main>
    </div>
  );
}

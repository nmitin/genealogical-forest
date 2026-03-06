import Link from "next/link";

import { prisma } from "@/lib/prisma";

function fullName(person: {
  lastName: string;
  firstName: string;
  middleName: string | null;
}) {
  return [person.lastName, person.firstName, person.middleName]
    .filter(Boolean)
    .join(" ");
}

export default async function PersonsPage() {
  const persons = await prisma.person.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      middleName: true,
      birthYear: true,
      isLiving: true,
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Persons
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Choose a person to open profile with parents and children.
            </p>
          </div>
          <Link className="text-sm text-muted-foreground underline" href="/">
            Back to home
          </Link>
        </div>

        {persons.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            No persons found. Run <code>pnpm db:seed</code>.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {persons.map((person) => (
              <Link
                key={person.id}
                href={`/persons/${person.id}`}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <h2 className="font-medium">{fullName(person)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {person.birthYear ? `Born: ${person.birthYear}` : "Birth year unknown"}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {person.isLiving ? "Living" : "Deceased"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

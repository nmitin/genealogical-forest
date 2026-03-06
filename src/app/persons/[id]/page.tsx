import Link from "next/link";
import { notFound } from "next/navigation";

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

function sexLabel(sex: "MALE" | "FEMALE" | "UNKNOWN") {
  if (sex === "MALE") return "Male";
  if (sex === "FEMALE") return "Female";
  return "Unknown";
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      father: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
        },
      },
      mother: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
        },
      },
      taggedPhotos: {
        select: { photoId: true },
      },
    },
  });

  if (!person) notFound();

  const children = await prisma.person.findMany({
    where: {
      OR: [{ fatherId: person.id }, { motherId: person.id }],
    },
    orderBy: [{ birthYear: "asc" }, { lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      middleName: true,
      birthYear: true,
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link className="text-sm text-muted-foreground underline" href="/persons">
            Back to persons
          </Link>
          <Link className="text-sm text-muted-foreground underline" href="/">
            Home
          </Link>
        </div>

        <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {fullName(person)}
          </h1>

          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Sex:</span> {sexLabel(person.sex)}
            </p>
            <p>
              <span className="text-muted-foreground">Birth year:</span>{" "}
              {person.birthYear ?? "Unknown"}
            </p>
            <p>
              <span className="text-muted-foreground">Living:</span>{" "}
              {person.isLiving ? "Yes" : "No"}
            </p>
            <p>
              <span className="text-muted-foreground">Tagged photos:</span>{" "}
              {person.taggedPhotos.length}
            </p>
          </div>

          {person.notes ? (
            <p className="mt-4 rounded-md bg-muted/60 p-3 text-sm text-muted-foreground">
              {person.notes}
            </p>
          ) : null}
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <h2 className="text-lg font-medium">Parents</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Father:</span>{" "}
                {person.father ? (
                  <Link className="underline" href={`/persons/${person.father.id}`}>
                    {fullName(person.father)}
                  </Link>
                ) : (
                  "Unknown"
                )}
              </p>
              <p>
                <span className="text-muted-foreground">Mother:</span>{" "}
                {person.mother ? (
                  <Link className="underline" href={`/persons/${person.mother.id}`}>
                    {fullName(person.mother)}
                  </Link>
                ) : (
                  "Unknown"
                )}
              </p>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <h2 className="text-lg font-medium">Children</h2>
            {children.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No children in tree.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link className="underline" href={`/persons/${child.id}`}>
                      {fullName(child)}
                    </Link>
                    {child.birthYear ? ` (${child.birthYear})` : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

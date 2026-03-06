import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { AlbumVisibility, Sex } from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.photoPerson.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.person.deleteMany();

  const grandfather = await prisma.person.create({
    data: {
      firstName: "Иван",
      lastName: "Митин",
      sex: Sex.MALE,
      birthYear: 1938,
      isLiving: false,
    },
  });

  const grandmother = await prisma.person.create({
    data: {
      firstName: "Мария",
      lastName: "Митина",
      sex: Sex.FEMALE,
      birthYear: 1941,
      isLiving: false,
    },
  });

  const father = await prisma.person.create({
    data: {
      firstName: "Александр",
      lastName: "Митин",
      sex: Sex.MALE,
      birthYear: 1968,
      fatherId: grandfather.id,
      motherId: grandmother.id,
      isLiving: true,
    },
  });

  const mother = await prisma.person.create({
    data: {
      firstName: "Елена",
      lastName: "Петрова",
      sex: Sex.FEMALE,
      birthYear: 1971,
      isLiving: true,
    },
  });

  const child = await prisma.person.create({
    data: {
      firstName: "Никита",
      lastName: "Митин",
      sex: Sex.MALE,
      birthYear: 1998,
      fatherId: father.id,
      motherId: mother.id,
      isLiving: true,
      notes: "Главная персона для начальной навигации.",
    },
  });

  const album = await prisma.album.create({
    data: {
      title: "Семейный архив",
      description: "Стартовый тестовый альбом",
      eventDate: new Date("2005-07-15T00:00:00.000Z"),
      visibility: AlbumVisibility.FAMILY,
    },
  });

  const photo = await prisma.photo.create({
    data: {
      albumId: album.id,
      storageKey: "seed/family-archive-2005.jpg",
      description: "Семейное фото",
      takenAt: new Date("2005-07-15T11:30:00.000Z"),
    },
  });

  await prisma.photoPerson.createMany({
    data: [
      { photoId: photo.id, personId: father.id },
      { photoId: photo.id, personId: mother.id },
      { photoId: photo.id, personId: child.id },
    ],
  });

  console.log("Seed completed", {
    persons: 5,
    albums: 1,
    photos: 1,
    tagged: 3,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

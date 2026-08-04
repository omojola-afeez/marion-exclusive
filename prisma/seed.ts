import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "handbags" },
    update: {},
    create: { name: "Handbags", slug: "handbags", description: "Leather goods and handbags." },
  });

  const designer = await prisma.designer.upsert({
    where: { slug: "marion-atelier" },
    update: {},
    create: { name: "Marion Atelier", slug: "marion-atelier", description: "In-house design studio." },
  });

  const collection = await prisma.collection.upsert({
    where: { slug: "autumn-26" },
    update: {},
    create: { name: "Autumn 26", slug: "autumn-26", description: "Seasonal collection." },
  });

  const product = await prisma.product.upsert({
    where: { slug: "signature-tote" },
    update: {},
    create: {
      name: "Signature Tote",
      slug: "signature-tote",
      description: "A hand-stitched leather tote.",
      price: 248.0,
      isFeatured: true,
      categoryId: category.id,
      designerId: designer.id,
      collectionId: collection.id,
      images: {
        create: [{ url: "/placeholder-tote.jpg", altText: "Signature Tote", position: 0 }],
      },
      variants: {
        create: [
          { sku: "TOTE-BLK-01", color: "Black", inventory: 12 },
          { sku: "TOTE-TAN-01", color: "Tan", inventory: 8 },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@marionexclusive.com" },
    update: {},
    create: {
      email: "admin@marionexclusive.com",
      name: "Admin",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Test Customer",
      role: "CUSTOMER",
    },
  });

  await prisma.cmsPage.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      title: "About Marion Exclusive",
      slug: "about",
      content: "Marion Exclusive is a house of considered, well-made goods.",
      isPublished: true,
    },
  });

  await prisma.cmsPage.upsert({
    where: { slug: "shipping" },
    update: {},
    create: {
      title: "Shipping",
      slug: "shipping",
      content: "Orders ship within 2-3 business days.",
      isPublished: true,
    },
  });

  console.log("Seed complete:", { category: category.name, designer: designer.name, product: product.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

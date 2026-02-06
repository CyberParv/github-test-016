import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@coffee.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@coffee.com",
      passwordHash,
      role: "admin",
      phone: "1234567890",
      address: "1 Admin St",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@coffee.com" },
    update: {},
    create: {
      name: "Staff User",
      email: "staff@coffee.com",
      passwordHash,
      role: "staff",
      phone: "5551234567",
      address: "2 Staff Ave",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@coffee.com" },
    update: {},
    create: {
      name: "Customer User",
      email: "customer@coffee.com",
      passwordHash,
      role: "customer",
      phone: "5559876543",
      address: "3 Customer Rd",
    },
  });

  const coffee = await prisma.category.upsert({
    where: { slug: "coffee" },
    update: {},
    create: { name: "Coffee", slug: "coffee" },
  });

  const tea = await prisma.category.upsert({
    where: { slug: "tea" },
    update: {},
    create: { name: "Tea", slug: "tea" },
  });

  const pastry = await prisma.category.upsert({
    where: { slug: "pastries" },
    update: {},
    create: { name: "Pastries", slug: "pastries" },
  });

  const products = await prisma.product.createMany({
    data: [
      {
        name: "Cappuccino",
        slug: "cappuccino",
        description: "Rich espresso with steamed milk and foam.",
        price: 4.5,
        categoryId: coffee.id,
        imageUrl: "https://images.example.com/cappuccino.jpg",
        available: true,
        tags: ["featured", "classic"],
      },
      {
        name: "Matcha Latte",
        slug: "matcha-latte",
        description: "Smooth matcha with creamy milk.",
        price: 5.0,
        categoryId: tea.id,
        imageUrl: "https://images.example.com/matcha.jpg",
        available: true,
        tags: ["featured", "seasonal"],
      },
      {
        name: "Butter Croissant",
        slug: "butter-croissant",
        description: "Flaky, buttery pastry baked fresh.",
        price: 3.25,
        categoryId: pastry.id,
        imageUrl: "https://images.example.com/croissant.jpg",
        available: true,
        tags: ["bakery"],
      },
    ],
  });

  const productList = await prisma.product.findMany({ take: 3 });

  if (productList.length > 0) {
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: productList[0].id,
        rating: 5,
        comment: "Absolutely delicious!",
      },
    });
  }

  await prisma.order.create({
    data: {
      userId: customer.id,
      items: [
        {
          productId: productList[0]?.id || "",
          name: productList[0]?.name || "Cappuccino",
          quantity: 2,
          price: 4.5,
        },
      ],
      subtotal: 9.0,
      tax: 0.9,
      total: 9.9,
      status: "completed",
      paymentMethod: "card",
      paymentStatus: "paid",
      pickupOrDelivery: "pickup",
    },
  });

  await prisma.reservation.create({
    data: {
      userId: customer.id,
      date: new Date(),
      time: "10:30",
      partySize: 2,
      status: "pending",
      notes: "Window seat if possible",
    },
  });

  await prisma.upload.create({
    data: {
      url: "https://images.example.com/uploaded.jpg",
      filename: "uploaded.jpg",
      contentType: "image/jpeg",
    },
  });

  await prisma.user.update({
    where: { id: admin.id },
    data: { address: "1 Admin St" },
  });

  await prisma.user.update({
    where: { id: staff.id },
    data: { address: "2 Staff Ave" },
  });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

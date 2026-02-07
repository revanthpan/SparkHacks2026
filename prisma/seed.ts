import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const sqlitePath = databaseUrl.startsWith("file:")
  ? databaseUrl.replace("file:", "")
  : databaseUrl;
const adapter = new PrismaBetterSqlite3({
  url: path.resolve(process.cwd(), sqlitePath),
});

const prisma = new PrismaClient({
  adapter,
});

const retailers = [
  {
    name: "Amazon",
    reputationScore: 4.6,
    reviewsCount: 182340,
    logoUrl: "https://logo.clearbit.com/amazon.com",
  },
  {
    name: "Best Buy",
    reputationScore: 4.3,
    reviewsCount: 42310,
    logoUrl: "https://logo.clearbit.com/bestbuy.com",
  },
  {
    name: "Walmart",
    reputationScore: 4.1,
    reviewsCount: 92210,
    logoUrl: "https://logo.clearbit.com/walmart.com",
  },
  {
    name: "Target",
    reputationScore: 4.4,
    reviewsCount: 56320,
    logoUrl: "https://logo.clearbit.com/target.com",
  },
];

const products = [
  {
    name: "Noise-Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation.",
    imageUrl:
      "https://images.unsplash.com/photo-1518441985310-008862d2f165?auto=format&fit=crop&w=800&q=80",
    category: "Audio",
  },
  {
    name: "14-inch Ultrabook Laptop",
    description: "Lightweight productivity laptop with 16GB RAM and 512GB SSD.",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    category: "Computers",
  },
  {
    name: "Smartwatch Pro",
    description: "Health tracking smartwatch with GPS and 3-day battery.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Wearables",
  },
  {
    name: "Smart Home Speaker",
    description: "Voice-enabled smart speaker with room-filling sound.",
    imageUrl:
      "https://images.unsplash.com/photo-1518441985310-008862d2f165?auto=format&fit=crop&w=800&q=80",
    category: "Home",
  },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.retailer.deleteMany();

  const createdRetailers = await prisma.retailer.createMany({
    data: retailers,
  });

  const createdProducts = await prisma.product.createMany({
    data: products,
  });

  const allRetailers = await prisma.retailer.findMany();
  const allProducts = await prisma.product.findMany();

  const listings = [
    {
      productName: "Noise-Cancelling Headphones",
      retailerName: "Amazon",
      price: 249.99,
      shippingSpeedDays: 2,
      driverErrorRate: 0.04,
      url: "https://amazon.com/",
    },
    {
      productName: "Noise-Cancelling Headphones",
      retailerName: "Best Buy",
      price: 229.99,
      shippingSpeedDays: 4,
      driverErrorRate: 0.06,
      url: "https://bestbuy.com/",
    },
    {
      productName: "Noise-Cancelling Headphones",
      retailerName: "Target",
      price: 239.0,
      shippingSpeedDays: 3,
      driverErrorRate: 0.05,
      url: "https://target.com/",
    },
    {
      productName: "14-inch Ultrabook Laptop",
      retailerName: "Amazon",
      price: 1199.0,
      shippingSpeedDays: 2,
      driverErrorRate: 0.03,
      url: "https://amazon.com/",
    },
    {
      productName: "14-inch Ultrabook Laptop",
      retailerName: "Best Buy",
      price: 1149.0,
      shippingSpeedDays: 3,
      driverErrorRate: 0.05,
      url: "https://bestbuy.com/",
    },
    {
      productName: "14-inch Ultrabook Laptop",
      retailerName: "Walmart",
      price: 1099.0,
      shippingSpeedDays: 5,
      driverErrorRate: 0.08,
      url: "https://walmart.com/",
    },
    {
      productName: "Smartwatch Pro",
      retailerName: "Target",
      price: 329.0,
      shippingSpeedDays: 3,
      driverErrorRate: 0.04,
      url: "https://target.com/",
    },
    {
      productName: "Smartwatch Pro",
      retailerName: "Walmart",
      price: 309.0,
      shippingSpeedDays: 4,
      driverErrorRate: 0.07,
      url: "https://walmart.com/",
    },
    {
      productName: "Smart Home Speaker",
      retailerName: "Amazon",
      price: 129.0,
      shippingSpeedDays: 1,
      driverErrorRate: 0.02,
      url: "https://amazon.com/",
    },
    {
      productName: "Smart Home Speaker",
      retailerName: "Best Buy",
      price: 139.0,
      shippingSpeedDays: 3,
      driverErrorRate: 0.05,
      url: "https://bestbuy.com/",
    },
  ];

  await prisma.listing.createMany({
    data: listings.map((listing) => {
      const product = allProducts.find(
        (item) => item.name === listing.productName
      );
      const retailer = allRetailers.find(
        (item) => item.name === listing.retailerName
      );

      if (!product || !retailer) {
        throw new Error("Missing product or retailer for listing seed.");
      }

      return {
        productId: product.id,
        retailerId: retailer.id,
        price: listing.price,
        shippingSpeedDays: listing.shippingSpeedDays,
        driverErrorRate: listing.driverErrorRate,
        url: listing.url,
      };
    }),
  });

  await prisma.review.createMany({
    data: [
      {
        retailerId: allRetailers[0].id,
        rating: 5,
        comment: "Fast delivery and reliable packaging.",
      },
      {
        retailerId: allRetailers[0].id,
        rating: 4,
        comment: "Great selection but occasional late delivery.",
      },
      {
        retailerId: allRetailers[1].id,
        rating: 4,
        comment: "Helpful support, shipping is steady.",
      },
      {
        retailerId: allRetailers[2].id,
        rating: 3,
        comment: "Budget friendly but delivery can be slow.",
      },
      {
        retailerId: allRetailers[3].id,
        rating: 5,
        comment: "Consistent shipping and easy returns.",
      },
    ],
  });

  console.log(
    `Seeded ${createdRetailers.count} retailers and ${createdProducts.count} products.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

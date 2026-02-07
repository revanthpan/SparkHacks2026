import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { calculateTrustScore } from "@/lib/trustScore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const minTrustRaw = searchParams.get("minTrust") ?? "0";
  const minTrust = Number.isNaN(Number(minTrustRaw))
    ? 0
    : Math.max(0, Math.min(100, Number(minTrustRaw)));

  const products = await prisma.product.findMany({
    where: query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,
    include: {
      listings: {
        include: {
          retailer: true,
        },
      },
    },
    take: 20,
  });

  const results = products.flatMap((product) =>
    product.listings.map((listing) => {
      const breakdown = calculateTrustScore({
        shippingSpeedDays: listing.shippingSpeedDays,
        reputationScore: listing.retailer.reputationScore,
        driverErrorRate: listing.driverErrorRate,
      });

      return {
        id: listing.id,
        price: listing.price,
        shippingSpeedDays: listing.shippingSpeedDays,
        driverErrorRate: listing.driverErrorRate,
        url: listing.url,
        inStock: listing.inStock,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          category: product.category,
        },
        retailer: {
          id: listing.retailer.id,
          name: listing.retailer.name,
          reputationScore: listing.retailer.reputationScore,
          reviewsCount: listing.retailer.reviewsCount,
          logoUrl: listing.retailer.logoUrl,
        },
        trustScore: breakdown.trustScore,
        breakdown,
      };
    })
  );

  const filtered = results.filter((result) => result.trustScore >= minTrust);

  const sorted = filtered.sort((a, b) => {
    if (b.trustScore !== a.trustScore) {
      return b.trustScore - a.trustScore;
    }
    return a.price - b.price;
  });

  return NextResponse.json({
    query,
    results: sorted,
  });
}

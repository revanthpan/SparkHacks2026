"use client";

import Image from "next/image";
import * as Progress from "@radix-ui/react-progress";
import * as Separator from "@radix-ui/react-separator";
import { AlertTriangle, ShieldCheck, Star, Truck } from "lucide-react";

import { ListingResult } from "@/types";
import { TrustScoreChart } from "@/components/TrustScoreChart";

type ListingCardProps = {
  listing: ListingResult;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100 lg:h-44 lg:w-56">
          {listing.product.imageUrl ? (
            <Image
              src={listing.product.imageUrl}
              alt={listing.product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 240px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
              No image available
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                {listing.product.category ?? "Product"}
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                {listing.product.name}
              </h3>
              <p className="text-sm text-slate-600">
                {listing.product.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Trust Score
              </p>
              <div className="flex items-center justify-end gap-2 text-3xl font-semibold text-slate-900">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                {listing.trustScore}
              </div>
            </div>
          </div>

          <Separator.Root className="h-px w-full bg-slate-200" />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Truck className="h-5 w-5 text-slate-700" />
              <div>
                <p className="text-xs uppercase text-slate-400">Shipping</p>
                <p className="font-semibold text-slate-900">
                  {listing.shippingSpeedDays} day delivery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Star className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs uppercase text-slate-400">Reputation</p>
                <p className="font-semibold text-slate-900">
                  {listing.retailer.reputationScore.toFixed(1)} stars
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <div>
                <p className="text-xs uppercase text-slate-400">Driver Errors</p>
                <p className="font-semibold text-slate-900">
                  {(listing.driverErrorRate * 100).toFixed(1)}% risk
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {listing.retailer.logoUrl ? (
                <Image
                  src={listing.retailer.logoUrl}
                  alt={listing.retailer.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-slate-200"
                />
              ) : null}
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {listing.retailer.name}
                </p>
                <p className="text-xs text-slate-500">
                  {listing.retailer.reviewsCount.toLocaleString()} reviews
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-slate-400">Price</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatPrice(listing.price)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Trust score progress</span>
              <span>{listing.trustScore}/100</span>
            </div>
            <Progress.Root
              value={listing.trustScore}
              className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200"
            >
              <Progress.Indicator
                className="h-full w-full bg-emerald-500 transition"
                style={{ transform: `translateX(-${100 - listing.trustScore}%)` }}
              />
            </Progress.Root>
          </div>

          <TrustScoreChart breakdown={listing.breakdown} />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <span className={listing.inStock ? "text-emerald-600" : "text-rose-500"}>
              {listing.inStock ? "In stock and verified" : "Out of stock"}
            </span>
            <a
              href={listing.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              View listing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

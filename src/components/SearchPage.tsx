"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as Slider from "@radix-ui/react-slider";
import { Search, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";

import { ListingCard } from "@/components/ListingCard";
import { ListingResult } from "@/types";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [minTrust, setMinTrust] = useState(60);
  const [results, setResults] = useState<ListingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topPick = useMemo(() => results[0], [results]);

  const fetchResults = async (nextQuery = query, nextTrust = minTrust) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/search", {
        params: { q: nextQuery, minTrust: nextTrust },
      });
      setResults(response.data.results ?? []);
    } catch (err) {
      console.error(err);
      setError("Unable to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchResults();
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-12">
        <header className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-10 text-white shadow-xl">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            <Sparkles className="h-4 w-4" />
            SafeShop AI
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            SafeShop ranks retailers by reliability, not just price.
          </h1>
          <p className="max-w-2xl text-base text-slate-200 md:text-lg">
            We score every listing with a Trust Score that blends shipping speed,
            retailer reputation, and driver error risk. Shop smarter, worry less.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur md:flex-row md:items-center"
          >
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-900">
              <Search className="h-5 w-5 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for laptops, headphones, smartwatches..."
                className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
            >
              Search listings
            </button>
          </form>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Truck className="h-5 w-5 text-emerald-500" />
              Shipping Speed
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Faster deliveries mean fewer delays and better overall reliability.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Star className="h-5 w-5 text-amber-500" />
              Retailer Reputation
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Review quality and customer feedback heavily influence trust.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Driver Error Risk
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Historical shipping data lowers rankings for risky routes.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Filter by minimum Trust Score
              </h2>
              <p className="text-sm text-slate-600">
                Increase the threshold to prioritize the safest retailers.
              </p>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              {minTrust}/100
            </div>
          </div>

          <div className="mt-6">
            <Slider.Root
              value={[minTrust]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => setMinTrust(value[0] ?? 0)}
              onValueCommit={(value) => fetchResults(query, value[0] ?? 0)}
              className="relative flex h-5 w-full items-center"
            >
              <Slider.Track className="relative h-2 w-full rounded-full bg-slate-200">
                <Slider.Range className="absolute h-full rounded-full bg-emerald-500" />
              </Slider.Track>
              <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-emerald-500 bg-white shadow" />
            </Slider.Root>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Reliable listings
              </h2>
              <p className="text-sm text-slate-600">
                {loading
                  ? "Updating trust scores..."
                  : `${results.length} listings ranked by reliability.`}
              </p>
            </div>
            {topPick ? (
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Top pick: {topPick.retailer.name} ({topPick.trustScore})
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {results.length === 0 && !loading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              No listings match this query yet. Try a different keyword.
            </div>
          ) : null}

          <div className="grid gap-6">
            {results.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

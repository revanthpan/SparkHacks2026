export type TrustScoreBreakdown = {
  shippingScore: number;
  reputationScore: number;
  driverScore: number;
  trustScore: number;
};

export type ListingResult = {
  id: string;
  price: number;
  shippingSpeedDays: number;
  driverErrorRate: number;
  url: string;
  inStock: boolean;
  trustScore: number;
  breakdown: TrustScoreBreakdown;
  product: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: string | null;
  };
  retailer: {
    id: string;
    name: string;
    reputationScore: number;
    reviewsCount: number;
    logoUrl: string | null;
  };
};

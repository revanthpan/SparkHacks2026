export type TrustScoreInput = {
  shippingSpeedDays: number;
  reputationScore: number;
  driverErrorRate: number;
};

export type TrustScoreBreakdown = {
  shippingScore: number;
  reputationScore: number;
  driverScore: number;
  trustScore: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeShipping = (days: number) => {
  const clampedDays = clamp(days, 1, 7);
  const score = 100 - ((clampedDays - 1) / 6) * 100;
  return clamp(score, 0, 100);
};

const normalizeReputation = (rating: number) => {
  const clampedRating = clamp(rating, 0, 5);
  return (clampedRating / 5) * 100;
};

const normalizeDriverError = (rate: number) => {
  const clampedRate = clamp(rate, 0, 0.2);
  const score = 100 - (clampedRate / 0.2) * 100;
  return clamp(score, 0, 100);
};

export const calculateTrustScore = (
  input: TrustScoreInput
): TrustScoreBreakdown => {
  const shippingScore = normalizeShipping(input.shippingSpeedDays);
  const reputationScore = normalizeReputation(input.reputationScore);
  const driverScore = normalizeDriverError(input.driverErrorRate);

  const trustScore =
    shippingScore * 0.35 + reputationScore * 0.45 + driverScore * 0.2;

  return {
    shippingScore: Math.round(shippingScore),
    reputationScore: Math.round(reputationScore),
    driverScore: Math.round(driverScore),
    trustScore: Math.round(trustScore),
  };
};

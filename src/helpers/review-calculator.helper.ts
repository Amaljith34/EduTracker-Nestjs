export const calculateReviewAmount = (amountPerHour: number, hours: number): number =>
  Number((amountPerHour * hours).toFixed(2));

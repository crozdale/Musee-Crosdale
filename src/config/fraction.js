export const FRACTION_DECIMALS = 18;

export function formatFractionAmount(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

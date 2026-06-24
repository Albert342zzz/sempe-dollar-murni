// Price map: flavorId -> { sizeLabel -> price }.
export type PriceMap = Record<string, Record<string, number>>;

// Returns the price for a flavor + size combination, or `fallback` if not set.
export function priceFor(
  map: PriceMap,
  flavorId: string,
  size: string,
  fallback = 0
): number {
  return map[flavorId]?.[size] ?? fallback;
}

// Prisma returns Decimal fields (price, totals, etc.) as Decimal objects,
// not plain JS numbers. Convert once here, at the data-fetching boundary,
// rather than scattering Number() calls through every component.
export function toPlainNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (value && typeof (value as { toNumber?: () => number }).toNumber === "function") {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

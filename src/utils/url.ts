/**
 * Normalizes a query parameter value to a single valid string value if and only if:
 * - The value is a string without any commas
 * - OR it is an array with exactly one string item (and that item doesn't contain commas)
 *
 * Returns null if:
 * - The value is undefined
 * - It contains multiple items
 * - It contains commas (indicating multiple selections)
 *
 * @param val - The raw query param value (string or array of strings)
 * @returns A single normalized string value or null
 */
export function normalizeSingleQueryParam(
  val: string | string[] | undefined,
): string | null {
  if (!val) return null;

  if (Array.isArray(val)) {
    return val.length === 1 && !val[0].includes(",") ? val[0] : null;
  }

  return val.includes(",") ? null : val;
}

/**
 * Returns a fully zoned ISO 8601 datetime string suitable for schema.org
 * datetime fields (uploadDate, datePublished, dateModified, etc.).
 *
 * Google's structured data validator rejects bare dates ("2024-01-01") and
 * zoneless datetimes ("2024-01-01T00:00:00"). This helper normalises any
 * input to a valid datetime with a timezone offset.
 *
 * Default zone: Jamaica (UTC-05:00, no DST) at 08:00 local time, matching
 * the brand's home timezone.
 */
const DEFAULT_TIME = "T08:00:00-05:00";
const FALLBACK = `2024-01-01${DEFAULT_TIME}`;

export function toSchemaDateTime(input?: string | Date | null): string {
  if (!input) return FALLBACK;

  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return FALLBACK;
    return input.toISOString();
  }

  const value = String(input).trim();
  if (!value) return FALLBACK;

  // Bare date: YYYY-MM-DD -> append default local time + Jamaica offset.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}${DEFAULT_TIME}`;
  }

  // Zoneless datetime: YYYY-MM-DDTHH:MM(:SS)(.sss) -> append Jamaica offset.
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(value)) {
    return `${value}-05:00`;
  }

  // Already has a Z or ±HH:MM offset -> trust it, but validate by parsing.
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return value;
  }

  // Last resort: try to parse and re-emit as UTC ISO.
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  return FALLBACK;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Guards uuid columns so malformed ids 404 instead of raising a Postgres cast error. */
export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

import type { Locale } from "./config";

export function makeT<K extends string>(dict: Record<Locale, Record<K, string>>, locale: Locale) {
  return (key: K): string => dict[locale][key] ?? dict.ar[key] ?? key;
}

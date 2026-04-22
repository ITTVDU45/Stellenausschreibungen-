export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function truncateText(value: string, max = 140) {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}…`;
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatCurrency(value: number | null | undefined, currency = "USD") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

/** Linear: interne USD-Nutzung → EUR-Anzeige (0,60 USD → 10,00 €). */
const API_COST_USD_TO_DISPLAY_EUR = 10 / 0.6;

export function formatApiCostEuro(value: number | null | undefined) {
  const base = value ?? 0;
  const display = Number.isFinite(base) ? base * API_COST_USD_TO_DISPLAY_EUR : 0;
  return formatCurrency(display, "EUR");
}

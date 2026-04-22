import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { de } from "date-fns/locale";

function parseToDate(value: string | number | null | undefined): { date: Date; label: string } | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = new Date(value);
    if (!isValid(parsed)) {
      return null;
    }
    return { date: parsed, label: String(value) };
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  const isoParsed = parseISO(raw);
  if (isValid(isoParsed)) {
    return { date: isoParsed, label: raw };
  }

  const loose = new Date(raw);
  if (isValid(loose)) {
    return { date: loose, label: raw };
  }

  return null;
}

export function formatDate(date: string | number | null | undefined, pattern = "dd.MM.yyyy") {
  const parsed = parseToDate(date);
  if (!parsed) {
    if (date == null || String(date).trim() === "") {
      return "Nicht gesetzt";
    }
    return String(date).trim();
  }

  try {
    return format(parsed.date, pattern, { locale: de });
  } catch {
    return parsed.label;
  }
}

export function formatRelative(date: string | number | null | undefined) {
  const parsed = parseToDate(date);
  if (!parsed) {
    if (date == null || String(date).trim() === "") {
      return "Nicht gesetzt";
    }
    return String(date).trim();
  }

  try {
    return formatDistanceToNowStrict(parsed.date, {
      addSuffix: true,
      locale: de,
    });
  } catch {
    return parsed.label;
  }
}

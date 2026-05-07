import { format, isValid, parse, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export function formatDate(value?: string | null, fallback = '-'): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return format(date, 'd MMM yyyy', { locale: tr });
}

export function formatLongDate(value?: string | null, fallback = '-'): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return format(date, 'd MMMM yyyy, EEEE', { locale: tr });
}

export function formatTime(value?: string | null, fallback = '-'): string {
  if (!value) return fallback;
  const normalized = value.trim();
  const parsedWithSeconds = parse(normalized, 'HH:mm:ss', new Date());
  const parsed = isValid(parsedWithSeconds)
    ? parsedWithSeconds
    : parse(normalized, 'HH:mm', new Date());
  if (isValid(parsed)) return format(parsed, 'HH:mm');
  const iso = parseDate(normalized);
  return iso ? format(iso, 'HH:mm') : fallback;
}

export function formatDateTimeRange(
  date?: string | null,
  start?: string | null,
  end?: string | null
) {
  const prettyDate = formatDate(date);
  const startText = formatTime(start, '');
  const endText = formatTime(end, '');
  const range = startText && endText ? `${startText}-${endText}` : startText || endText;
  return range ? `${prettyDate} · ${range}` : prettyDate;
}

export function formatDuration(minutes?: number | null, fallback = '-'): string {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes)) return fallback;
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} sa ${rest} dk` : `${hours} sa`;
}

export function formatScore(goalsFor?: number | null, goalsAgainst?: number | null): string | null {
  if (goalsFor === undefined || goalsFor === null) return null;
  return `${goalsFor} - ${goalsAgainst ?? 0}`;
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const normalized = value.trim();
  const iso = parseISO(normalized);
  if (isValid(iso)) return iso;
  const dateOnly = parse(normalized, 'yyyy-MM-dd', new Date());
  if (isValid(dateOnly)) return dateOnly;
  const dateTime = new Date(normalized);
  return isValid(dateTime) ? dateTime : null;
}

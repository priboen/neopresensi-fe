export function formatDateIndo(dateStr: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Date(dateStr).toLocaleDateString("id-ID", options);
}

// utils/time.ts
export function formatTime(timeStr: string): string {
  // Handle both "HH:mm" and "h:mm a" formats
  const regex12Hour = /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i;
  const regex24Hour = /^(\d{1,2}):(\d{2})$/;

  let hours: number, minutes: number;

  if (regex12Hour.test(timeStr)) {
    const match = timeStr.match(regex12Hour);
    if (!match) throw new Error("Invalid time format");
    hours = parseInt(match[1]);
    minutes = parseInt(match[2]);
    const period = match[3]?.toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  } else if (regex24Hour.test(timeStr)) {
    const match = timeStr.match(regex24Hour);
    if (!match) throw new Error("Invalid time format");
    hours = parseInt(match[1]);
    minutes = parseInt(match[2]);
  } else {
    throw new Error("Invalid time format");
  }

  // Ensure valid time
  if (hours > 23 || minutes > 59) {
    throw new Error("Invalid time values");
  }

  // Format to HH:mm:ss
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;
}

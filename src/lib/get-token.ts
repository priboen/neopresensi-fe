export function getTokenFromCookie(cookieName: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));
  return match ? match.split("=")[1] : null;
}

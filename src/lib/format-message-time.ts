export function formatMessageTime(timestamp: string) {
  const messageDate = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - messageDate.getTime()) / (60 * 1000),
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Untuk pesan hari ini, tampilkan jam
  if (diffInDays === 0) {
    if (diffInMinutes < 60) {
      return diffInMinutes === 0 ? "baru saja" : `${diffInMinutes} mnt`;
    }

    return messageDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Untuk pesan dalam 7 hari terakhir, tampilkan nama hari
  if (diffInDays < 7) {
    return messageDate.toLocaleDateString("id-ID", { weekday: "long" });
  }

  // Untuk pesan tahun ini, tampilkan tanggal tanpa tahun
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }

  // Untuk pesan lama, tampilkan lengkap
  return messageDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

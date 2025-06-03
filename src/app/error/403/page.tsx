// src/app/403/page.tsx
"use client"; // Diperlukan karena kita akan menggunakan hook dan event handler

import styles from "./ForbiddenPage.module.css";
import { Varela_Round, Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Impor useRouter untuk navigasi

// Konfigurasi Google Fonts
const varelaRound = Varela_Round({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "500"],
  display: "swap",
});

// Ambil nama cookie dari environment variable
// Pastikan variabel ini diawali dengan NEXT_PUBLIC_ agar bisa diakses client-side
const AUTH_TOKEN_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "fallbackAuthCookieName";

export default function ForbiddenPage() {
  const router = useRouter();

  const handleLogout = () => {
    if (
      !AUTH_TOKEN_COOKIE_NAME ||
      AUTH_TOKEN_COOKIE_NAME === "fallbackAuthCookieName"
    ) {
      console.error(
        "Nama cookie autentikasi tidak dikonfigurasi di .env untuk logout!"
      );
      // Anda bisa menampilkan notifikasi error di sini jika diperlukan
      return;
    }

    // Menghapus cookie autentikasi spesifik
    console.log(`Menghapus cookie: ${AUTH_TOKEN_COOKIE_NAME}`);
    document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    // Catatan: Menghapus *semua* cookie untuk sebuah domain secara programatik dari sisi klien itu sulit
    // dan seringkali tidak bisa dilakukan sepenuhnya (misalnya untuk cookie HttpOnly).
    // Fokus pada penghapusan cookie autentikasi spesifik biasanya adalah tindakan yang tepat untuk logout.

    router.push("/login"); // Arahkan ke halaman login
    // router.refresh(); // Opsional: bisa membantu me-refresh state server jika ada
    // tapi karena kita redirect ke /login, mungkin tidak terlalu krusial di sini.
  };

  return (
    <div className={`${styles.forbiddenPageContainer} ${poppins.className}`}>
      <div className={styles.message}>You are not authorized.</div>
      <div className={styles.message2}>
        You tried to access a page you did not have prior authorization for.
      </div>

      <div className={styles.mainContentContainer}>
        <div className={`${styles.neon} ${varelaRound.className}`}>403</div>
        <div className={styles.doorFrame}>
          <div className={styles.door}>
            <div className={styles.rectangle}></div>
            <div className={styles.handle}></div>
            <div className={styles.window}>
              <div className={styles.eye}></div>
              <div className={`${styles.eye} ${styles.eye2Modifier}`}></div>
              <div className={styles.leaf}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Container untuk tombol aksi */}
      <div className={styles.actionsContainer}>
        <Link href="/" className={styles.actionButton}>
          Kembali ke Halaman Utama
        </Link>
        <button
          onClick={handleLogout}
          className={`${styles.actionButton} ${styles.logoutButton}`}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

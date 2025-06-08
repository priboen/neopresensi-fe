import { title } from "process";
import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "FITUR UTAMA",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Kehadiran",
        url: "/attendance",
        icon: Icons.Calendar,
        items: [
          { title: "Data Kehadiran", url: "/attendance/data" },
          { title: "Data Perizinan", url: "/attendance/permission" },
          { title: "QR Absen", url: "/attendance/qr" },
          { title: "Jam Kerja", url: "/attendance/setting" },
        ],
      },
      {
        title: "Pengguna",
        url: "/user",
        icon: Icons.User,
        items: [],
      },
    ],
  },
  {
    label: "FITUR TAMBAHAN",
    items: [
      {
        title: "CCTV",
        icon: Icons.PieChart,
        items: [
          {
            title: "Streaming CCTV",
            url: "/cctv/streaming",
          },
          {
            title: "Setting CCTV",
            url: "/cctv/streaming",
          },
        ],
      },
    ],
  },
];

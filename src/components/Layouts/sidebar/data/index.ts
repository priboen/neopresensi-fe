import { url } from "inspector";
import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "AKADEMIK",
    items: [
      {
        title: "Data Kelas",
        icon: Icons.Classroom,
        items: [
          { title: "Kelas", url: "/academic/classes" },
          {
            title: "Rombongan Belajar",
            url: "/academic/groups",
          },
        ],
      },
      {
        title: "Data Mata Pelajaran",
        icon: Icons.Alphabet,
        url: "/academic/subjects",
        items: [],
      },
      {
        title: "Jadwal Mata Pelajaran",
        icon: Icons.Calendar,
        url: "/academic/schedule",
        items: [],
      },
      {
        title: "Penugasan Guru",
        url: "/academic/assign-teachers",
        icon: Icons.TeacherAssignment,
        items: [],
      },
    ],
  },
  {
    label: "KEHADIRAN",
    items: [
      {
        title: "Presensi Guru",
        url: "/attendance/data",
        icon: Icons.FaceRecognition,
        items: [],
      },
      {
        title: "Perizinan",
        url: "/attendance/permission",
        icon: Icons.Permission,
        items: [],
      },
    ],
  },
  {
    label: "RAPAT",
    items: [
      {
        title: "Data Rapat",
        url: "/meeting/data",
        icon: Icons.Meeting,
        items: [],
      },
      {
        title: "Undangan Rapat",
        url: "/meeting/invitations",
        icon: Icons.QRCode,
        items: [],
      },
    ],
  },
  {
    label: "CCTV",
    items: [
      {
        title: "Data CCTV",
        url: "/cctv/data",
        icon: Icons.IPCamera,
        items: [],
      },
      {
        title: "Jadwal CCTV",
        url: "/cctv/schedule",
        icon: Icons.FourCircle,
        items: [],
      },
    ],
  },
  {
    label: "PENGATURAN",
    items: [
      {
        title: "Pengguna",
        icon: Icons.Setting,
        items: [
          {
            title: "Daftar Pengguna",
            url: "/settings/users",
          },
          {
            title: "Face Embedding",
            url: "/settings/embedding",
          },
        ],
      },
    ],
  },
];

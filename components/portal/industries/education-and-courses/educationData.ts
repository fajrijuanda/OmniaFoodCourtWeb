import { Users, BookOpen, GraduationCap, Calendar } from "lucide-react";

export const lmsRows = [
  { Course: "Pengantar TI", Code: "TI101", Lecturer: "Dr. Budi", Enrolled: "45 students", Status: "active" },
  { Course: "Algoritma Dasar", Code: "CS102", Lecturer: "Prof. Siti", Enrolled: "38 students", Status: "active" },
];

export const kknRows = [
  { Group: "Kelompok 01", Location: "Desa Suka Maju", Members: "12 students", Supervisor: "Pak Anton", Status: "active" },
  { Group: "Kelompok 02", Location: "Desa Harapan", Members: "15 students", Supervisor: "Bu Siska", Status: "active" },
];

export const academicRows = [
  { Type: "Cuti Akademik", Student: "Andi Saputra", Date: "12 Okt 2023", Status: "pending" },
  { Type: "Surat Keterangan Lulus", Student: "Budi Santoso", Date: "14 Okt 2023", Status: "approved" },
];

export const campusAnnouncements = [
  { title: "UAS Semester Ganjil dimulai", meta: "Biro Akademik - 12 Jan 2024", tag: "Akademik" },
  { title: "Batas Akhir Pengumpulan Nilai", meta: "Fakultas Teknik - 15 Jan 2024", tag: "Dosen" },
];

export const campusQuickActions = [
  { icon: Users, title: "Data Mahasiswa", body: "Lihat dan kelola direktori mahasiswa aktif" },
  { icon: BookOpen, title: "Katalog Mata Kuliah", body: "Daftar mata kuliah dan kurikulum program studi" },
  { icon: GraduationCap, title: "Yudisium", body: "Persyaratan kelulusan dan pendaftaran yudisium" },
  { icon: Calendar, title: "Kalender Akademik", body: "Jadwal perkuliahan, ujian, dan hari libur" },
];

import ExcelJS from "exceljs";
import { prisma } from "./prisma";
import { getEffectiveStatus, statusLabel, type EffectiveStatus } from "./sessionStatus";
import type { Locale } from "@/i18n/config";

const MAROON = "FF8A1538";
const GOLD = "FFE8B923";

const STATUS_FILL: Record<EffectiveStatus, string> = {
  SCHEDULED: "FFDBEAFE",
  COMPLETED: "FFDCFCE7",
  MISSED: "FFFEE2E2",
  CANCELLED: "FFF3F4F6",
};
const STATUS_FONT: Record<EffectiveStatus, string> = {
  SCHEDULED: "FF1D4ED8",
  COMPLETED: "FF15803D",
  MISSED: "FFB91C1C",
  CANCELLED: "FF4B5563",
};

const COLUMNS: Record<Locale, string[]> = {
  ar: [
    "اسم الطالب",
    "البريد الإلكتروني",
    "التاريخ",
    "الوقت",
    "الحالة",
    "محور الحصة",
    "تقييم المعلم للطالب",
    "تقييم الطالب للمعلم",
  ],
  en: [
    "Student Name",
    "Student Email",
    "Date",
    "Time",
    "Status",
    "Surah Focus",
    "Teacher's Rating of Student",
    "Student's Rating of Teacher",
  ],
};

export async function buildTeacherScheduleWorkbook(
  teacherId: string,
  locale: Locale
): Promise<ExcelJS.Buffer> {
  const [teacher, sessions] = await Promise.all([
    prisma.user.findUnique({ where: { id: teacherId } }),
    prisma.session.findMany({
      where: { teacherId },
      include: { student: true },
      orderBy: { startAt: "desc" },
    }),
  ]);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(locale === "ar" ? "الجدول" : "Schedule", {
    views: [{ rightToLeft: locale === "ar", state: "frozen", ySplit: 2 }],
  });

  const columns = COLUMNS[locale];
  sheet.columns = [
    { width: 26 },
    { width: 28 },
    { width: 14 },
    { width: 10 },
    { width: 14 },
    { width: 26 },
    { width: 20 },
    { width: 20 },
  ];

  const titleRow = sheet.addRow([
    `${teacher?.name ?? ""} — ${locale === "ar" ? "جدول الحصص" : "Session Schedule"}`,
  ]);
  sheet.mergeCells(titleRow.number, 1, titleRow.number, columns.length);
  titleRow.height = 28;
  titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: GOLD } };
  titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
  titleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: MAROON } };
  for (let i = 2; i <= columns.length; i++) {
    titleRow.getCell(i).fill = { type: "pattern", pattern: "solid", fgColor: { argb: MAROON } };
  }

  const headerRow = sheet.addRow(columns);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: MAROON } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
  headerRow.height = 20;

  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    timeZone: "Asia/Riyadh",
    hour: "numeric",
    minute: "2-digit",
  });

  for (const session of sessions) {
    const effectiveStatus = getEffectiveStatus(session);
    const row = sheet.addRow([
      session.student?.name ?? "",
      session.student?.email ?? "",
      dateFmt.format(session.startAt),
      timeFmt.format(session.startAt),
      statusLabel(effectiveStatus, locale),
      session.surahFocus || "",
      session.rating ?? "",
      session.studentRating ?? "",
    ]);
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(1).alignment = { horizontal: locale === "ar" ? "right" : "left" };
    row.getCell(6).alignment = { horizontal: locale === "ar" ? "right" : "left" };
    const statusCell = row.getCell(5);
    statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: STATUS_FILL[effectiveStatus] } };
    statusCell.font = { bold: true, color: { argb: STATUS_FONT[effectiveStatus] } };
  }

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return;
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
  });

  return workbook.xlsx.writeBuffer();
}

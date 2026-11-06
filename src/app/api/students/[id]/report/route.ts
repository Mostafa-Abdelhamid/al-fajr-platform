import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildStudentReportHtml } from "@/lib/reportTemplate";
import { renderHtmlToPdf } from "@/lib/pdf";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { apiMessages } from "@/i18n/dictionaries/apiMessages";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const t = makeT(apiMessages, locale);

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }

  const { id } = await params;

  const isSelf = user.id === id;
  const isAdmin = user.role === "ADMIN";
  const isLinkedTeacher =
    user.role === "TEACHER" &&
    !!(await prisma.session.findFirst({ where: { studentId: id, teacherId: user.id } }));

  if (!isSelf && !isAdmin && !isLinkedTeacher) {
    return NextResponse.json({ error: t("noLinkToStudent") }, { status: 403 });
  }

  const html = await buildStudentReportHtml(id, locale);
  const pdfBuffer = await renderHtmlToPdf(html);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="progress-report-${id}.pdf"`,
    },
  });
}

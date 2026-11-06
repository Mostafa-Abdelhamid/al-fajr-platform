import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderHtmlToPdf } from "@/lib/pdf";
import { buildCertificateHtml } from "@/lib/certificateTemplate";
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
  const cert = await prisma.certificate.findUnique({ where: { id }, include: { student: true } });
  if (!cert) {
    return NextResponse.json({ error: t("notFound") }, { status: 404 });
  }

  const isOwner = cert.studentId === user.id;
  const isAdmin = user.role === "ADMIN";
  const isLinkedTeacher =
    user.role === "TEACHER" &&
    !!(await prisma.session.findFirst({ where: { studentId: cert.studentId, teacherId: user.id } }));

  if (!isOwner && !isAdmin && !isLinkedTeacher) {
    return NextResponse.json({ error: t("unauthorized") }, { status: 403 });
  }

  const html = buildCertificateHtml(
    {
      title: cert.title,
      studentName: cert.student.name,
      type: cert.type,
      sessionsAtIssue: cert.sessionsAtIssue,
      note: cert.note,
      createdAt: cert.createdAt,
    },
    locale
  );
  const pdfBuffer = await renderHtmlToPdf(html, { landscape: true });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificate-${id}.pdf"`,
    },
  });
}

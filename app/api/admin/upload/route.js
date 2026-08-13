import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Nahrání fotky do Blob storage. Vrací veřejnou URL. */
export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Nepřihlášeno" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const slug = (form.get("slug") || "misc").toString().replace(/[^a-z0-9-]/gi, "-");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });
  }
  if (!file.type?.startsWith("image/")) {
    return NextResponse.json({ error: "Nahrát lze jen obrázek." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Obrázek je větší než 8 MB." }, { status: 400 });
  }

  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const blob = await put(`bx/${slug}/${Date.now()}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}

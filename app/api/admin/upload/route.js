import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { saveMedia } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Nahrání fotky do datového adresáře. Vrací cestu, pod kterou web fotku servíruje. */
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
  // Admin fotky zmenšuje už v prohlížeči; tenhle limit je jen pojistka pro
  // formáty, které prohlížeč neotevře (např. HEIC z iPhonu).
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Obrázek má přes 25 MB. Uložte ho prosím jako JPG a zkuste to znovu." },
      { status: 400 }
    );
  }

  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveMedia(`${slug}/${name}`, buffer);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Fotku se nepodařilo uložit." }, { status: 500 });
  }
}

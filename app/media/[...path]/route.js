import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

import { mediaPath } from "@/lib/storage";

export const runtime = "nodejs";

/** Typ podle přípony — v datovém adresáři jsou jen obrázky z adminu. */
const TYPES = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  avif: "image/avif",
  svg: "image/svg+xml",
};

/**
 * Servíruje fotky nahrané v adminu.
 *
 * Leží mimo složku `public`, protože ta se při nasazení přepisuje — tahle
 * routa je proto čte přímo z datového adresáře.
 */
export async function GET(_req, { params }) {
  const { path: parts } = await params;
  const target = mediaPath(parts || []);
  if (!target) return new NextResponse("Not found", { status: 404 });

  try {
    const stat = await fs.stat(target);
    if (!stat.isFile()) throw new Error("not a file");

    const ext = target.split(".").pop()?.toLowerCase() || "";
    return new NextResponse(Readable.toWeb(createReadStream(target)), {
      headers: {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Content-Length": String(stat.size),
        // Název souboru nese časové razítko, takže se obsah pod stejnou
        // adresou nikdy nezmění a může se cachovat natrvalo.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

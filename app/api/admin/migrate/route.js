import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { list } from "@vercel/blob";

import { isAuthed } from "@/lib/adminAuth";
import { readJson, saveMedia, writeJson } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Jednorázové přetažení obsahu z Vercel Blobu na disk serveru.
 *
 * Spouští ho přihlášený admin a běží celé na serveru — token k Blobu se
 * tak nikdy nedostane do prohlížeče. Stačí mít v proměnných
 * BLOB_READ_WRITE_TOKEN a po přenosu ji zase smazat.
 *
 * Fotky z Blobu dostanou nové adresy pod /media a odkazy na ně se
 * v obsahu rovnou přepíšou, aby po přepnutí nikde nezůstala viset
 * adresa na starý Blob.
 */
export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Nepřihlášeno" }, { status: 401 });
  }
  const params = new URL(req.url).searchParams;
  const force = params.get("force") === "1";
  const from = params.get("from");

  if (!process.env.BLOB_READ_WRITE_TOKEN && !from) {
    return NextResponse.json(
      {
        error:
          "Chybí proměnná BLOB_READ_WRITE_TOKEN. Bez ní jde přenést jen obsah webu — " +
          "přidejte ?from=<veřejná adresa data.json>.",
      },
      { status: 400 }
    );
  }

  if (!force && (await readJson("bx/data.json"))) {
    return NextResponse.json(
      { error: "Obsah už na serveru je. Pro přepsání přidejte ?force=1." },
      { status: 409 }
    );
  }

  // Bez tokenu umíme jen obsah webu — ten leží na veřejné adrese.
  // Poptávky a nahrané fotky se bez tokenu vyjmenovat nedají.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const res = await fetch(from, { cache: "no-store" });
      if (!res.ok) throw new Error(`stažení selhalo (${res.status})`);
      await writeJson("bx/data.json", await res.json());
      revalidatePath("/safy-bx");
      revalidatePath("/safy-bx/v3");
      revalidatePath("/safy-bx/[slug]", "page");
      return NextResponse.json({
        ok: true,
        data: true,
        leads: 0,
        media: 0,
        poznamka: "Bez tokenu se přenesl jen obsah webu, ne poptávky a nahrané fotky.",
      });
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  const report = { data: false, leads: 0, media: 0, chyby: [] };

  try {
    const { blobs } = await list({ limit: 1000 });
    const mapa = new Map(); // stará adresa v Blobu → nová pod /media

    // 1) Fotky — stáhnout a uložit, zapamatovat si novou adresu
    for (const b of blobs) {
      if (!b.pathname.startsWith("bx/") || b.pathname.endsWith(".json")) continue;
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const buf = Buffer.from(await res.arrayBuffer());
        const rel = b.pathname.replace(/^bx\//, "");
        mapa.set(b.url, await saveMedia(rel, buf));
        report.media += 1;
      } catch (e) {
        report.chyby.push(`${b.pathname}: ${e.message}`);
      }
    }

    // 2) Poptávky
    for (const b of blobs) {
      if (!b.pathname.startsWith("bx/leads/")) continue;
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const lead = await res.json();
        await writeJson(`bx/leads/${lead.id}.json`, lead);
        report.leads += 1;
      } catch (e) {
        report.chyby.push(`${b.pathname}: ${e.message}`);
      }
    }

    // 3) Obsah webu + přepsání adres fotek
    const dataBlob = blobs.find((b) => b.pathname === "bx/data.json");
    if (dataBlob) {
      const res = await fetch(dataBlob.url, { cache: "no-store" });
      if (res.ok) {
        let raw = JSON.stringify(await res.json());
        for (const [staraUrl, novaUrl] of mapa) raw = raw.split(staraUrl).join(novaUrl);
        await writeJson("bx/data.json", JSON.parse(raw));
        report.data = true;
      }
    }

    revalidatePath("/safy-bx");
    revalidatePath("/safy-bx/v3");
    revalidatePath("/safy-bx/[slug]", "page");

    return NextResponse.json({ ok: true, ...report });
  } catch (e) {
    return NextResponse.json({ error: e.message, ...report }, { status: 500 });
  }
}

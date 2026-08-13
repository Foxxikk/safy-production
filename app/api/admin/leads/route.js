import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { getLeads, saveLeads } from "@/lib/bxLeads";

export const runtime = "nodejs";

async function guard() {
  return (await isAuthed()) ? null : NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  const no = await guard();
  if (no) return no;
  return NextResponse.json({ leads: await getLeads() });
}

/** Akce: read | unread | archive | unarchive | delete (+ ids) */
export async function PATCH(req) {
  const no = await guard();
  if (no) return no;

  const { action, ids } = await req.json();
  const set = new Set(Array.isArray(ids) ? ids : [ids]);
  let list = await getLeads();

  if (action === "delete") {
    list = list.filter((l) => !set.has(l.id));
  } else {
    list = list.map((l) =>
      set.has(l.id)
        ? {
            ...l,
            read: action === "read" ? true : action === "unread" ? false : l.read,
            archived:
              action === "archive" ? true : action === "unarchive" ? false : l.archived,
          }
        : l
    );
  }

  return NextResponse.json({ leads: await saveLeads(list) });
}

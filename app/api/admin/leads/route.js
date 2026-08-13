import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { getLeads, updateLeads } from "@/lib/bxLeads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const allowed = ["read", "unread", "archive", "unarchive", "delete"];
  if (!allowed.includes(action)) {
    return NextResponse.json({ error: "bad action" }, { status: 400 });
  }

  return NextResponse.json({ leads: await updateLeads(ids, action) });
}

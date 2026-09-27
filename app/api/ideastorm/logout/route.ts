import { NextResponse } from "next/server";
import { destroySession } from "@/lib/ideastorm/session";

export async function POST() {
    await destroySession();
    return NextResponse.json({ success: true });
}

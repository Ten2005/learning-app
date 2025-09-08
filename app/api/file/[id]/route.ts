import { NextRequest, NextResponse } from "next/server";
import { updateFile } from "@/lib/db/file";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { title, content } = await req.json();
    const file = await updateFile(Number(params.id), title, content);
    return NextResponse.json(file);
  } catch (error) {
    console.error("Error updating file:", error);
    return new NextResponse("Failed to update file", { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/gallery/[id] — serve gallery image bytes from the DB.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const imageId = Number(id);
  if (!Number.isInteger(imageId)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await prisma.galleryImage.findUnique({
    where: { id: imageId },
  });
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(Buffer.from(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      // The URL always carries ?v=updatedAt, so it is safe to cache long-term.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const society = searchParams.get("society") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") || "";

  const where: any = {};

  if (title) where.title = { contains: title.toLowerCase() };
  if (society) where.society = { contains: society.toLowerCase() };
  if (status) where.status = status;
  if (date) where.creationDate = new Date(date);

  const posts = await prisma.post.findMany({ where });

  const grouped: Record<string, number> = {};

  posts.forEach((post) => {
    const isoDate = new Date(post.creationDate).toISOString().split("T")[0]; // 2025-10-06
    grouped[isoDate] = (grouped[isoDate] || 0) + 1;
  });

  const result = Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return Response.json(result);
}

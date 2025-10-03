import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const title = searchParams.get("title") || "";
  const society = searchParams.get("society") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") || "";

  const where: any = {};

    if (title) {
    where.title = { contains: title.toLowerCase() };
    }
    if (society) {
    where.society = { contains: society.toLowerCase() };
    }
  if (status) {
    where.status = status;
  }
  if (date) {
    // si tu veux exact match
    where.creationDate = new Date(date);
  }

  const total = await prisma.post.count({ where });

  const data = await prisma.post.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { creationDate: "desc" },
  });

  return Response.json({
    data,
    meta: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  });
}

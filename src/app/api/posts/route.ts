import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const published = searchParams.get("published")

  const where = published !== null ? { published: published === "true" } : {}

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        tags: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.post.count({ where }),
  ])

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, slug, content, excerpt, published, categoryId, tagIds } = body

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "Title, slug, and content are required" },
      { status: 400 }
    )
  }

  const existingPost = await db.post.findUnique({ where: { slug } })
  if (existingPost) {
    return NextResponse.json(
      { error: "Slug already exists" },
      { status: 400 }
    )
  }

  const post = await db.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      published: published || false,
      publishedAt: published ? new Date() : null,
      author: { connect: { id: session.user.id } },
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      tags: tagIds ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
    },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  })

  return NextResponse.json(post, { status: 201 })
}

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("postId")

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 })
  }

  const comments = await db.comment.findMany({
    where: {
      postId,
      approved: true,
      parentId: null,
    },
    include: {
      author: { select: { name: true, image: true } },
      children: {
        include: {
          author: { select: { name: true, image: true } },
          children: {
            include: {
              author: { select: { name: true, image: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(comments)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { postId, content, parentId, guestName, guestEmail } = body

  if (!postId || !content) {
    return NextResponse.json(
      { error: "postId and content are required" },
      { status: 400 }
    )
  }

  // For guest comments, create or find a guest user
  let authorId: string

  if (guestEmail) {
    let guestUser = await db.user.findUnique({
      where: { email: guestEmail },
    })

    if (!guestUser) {
      guestUser = await db.user.create({
        data: {
          email: guestEmail,
          name: guestName || "匿名用户",
        },
      })
    }

    authorId = guestUser.id
  } else {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    )
  }

  const comment = await db.comment.create({
    data: {
      content,
      postId,
      authorId,
      parentId: parentId || null,
      approved: true, // Auto-approve for now
    },
    include: {
      author: { select: { name: true, image: true } },
    },
  })

  return NextResponse.json(comment, { status: 201 })
}

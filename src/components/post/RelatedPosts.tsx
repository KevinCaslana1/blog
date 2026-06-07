import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface Props {
  currentPostId: string
  tagIds: string[]
}

export async function RelatedPosts({ currentPostId, tagIds }: Props) {
  const relatedPosts = await db.post.findMany({
    where: {
      published: true,
      id: { not: currentPostId },
      tags: { some: { id: { in: tagIds } } },
    },
    include: {
      tags: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })

  if (relatedPosts.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          相关文章
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {formatDate(post.publishedAt || post.createdAt)}
              </p>
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

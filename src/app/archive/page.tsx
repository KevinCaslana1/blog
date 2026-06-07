import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Calendar, FileText } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "归档",
  description: "所有文章按时间归档",
}

export default async function ArchivePage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      createdAt: true,
      category: { select: { name: true } },
    },
  })

  // Group posts by year and month
  const grouped = posts.reduce((acc, post) => {
    const date = new Date(post.publishedAt || post.createdAt)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const key = `${year}-${month.toString().padStart(2, "0")}`

    if (!acc[key]) {
      acc[key] = { year, month, posts: [] }
    }
    acc[key].posts.push(post)
    return acc
  }, {} as Record<string, { year: number; month: number; posts: typeof posts }>)

  const sortedGroups = Object.values(grouped).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Calendar className="h-8 w-8" />
        文章归档
      </h1>

      <div className="space-y-8">
        {sortedGroups.map((group) => (
          <div key={`${group.year}-${group.month}`}>
            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
              {group.year} 年 {group.month} 月
            </h2>
            <div className="space-y-2">
              {group.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{post.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.category && (
                      <Badge variant="secondary" className="text-xs">
                        {post.category.name}
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

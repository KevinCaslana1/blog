import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/Sidebar"
import { db } from "@/lib/db"
import { formatDate, readingTime } from "@/lib/utils"
import { POSTS_PER_PAGE } from "@/lib/constants"
import { Calendar, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const skip = (page - 1) * POSTS_PER_PAGE

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      skip,
      take: POSTS_PER_PAGE,
    }),
    db.post.count({ where: { published: true } }),
  ])

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                暂无文章
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{readingTime(post.content)} 分钟阅读</span>
                    <Eye className="h-4 w-4 ml-2" />
                    <span>{post.viewCount} 次浏览</span>
                  </div>
                  <Link href={`/post/${post.slug}`}>
                    <h2 className="text-2xl font-bold hover:text-primary transition-colors">
                      {post.pinned && (
                        <Badge variant="default" className="mr-2">置顶</Badge>
                      )}
                      {post.title}
                    </h2>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt || post.content.slice(0, 200) + "..."}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.category && (
                      <Link href={`/category/${post.category.slug}`}>
                        <Badge variant="secondary">{post.category.name}</Badge>
                      </Link>
                    )}
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`}>
                        <Badge variant="outline">{tag.name}</Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/?page=${page - 1}`}>
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/?page=${p}`}>
                  <Button variant={p === page ? "default" : "outline"} size="icon">
                    {p}
                  </Button>
                </Link>
              ))}
              {page < totalPages && (
                <Link href={`/?page=${page + 1}`}>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

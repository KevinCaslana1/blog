import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { formatDate, readingTime } from "@/lib/utils"
import { Calendar, Clock, Eye, Folder } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await db.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  })

  if (!category) return {}

  return {
    title: `分类: ${category.name}`,
    description: category.description || `浏览所有 ${category.name} 分类下的文章`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = await db.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        include: {
          author: { select: { name: true } },
          tags: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  })

  if (!category) notFound()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Folder className="h-5 w-5" />
          <span>分类</span>
        </div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-2">{category.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {category.posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              该分类下暂无文章
            </CardContent>
          </Card>
        ) : (
          category.posts.map((post) => (
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
                    {post.title}
                  </h2>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {post.excerpt || post.content.slice(0, 200) + "..."}
                </p>
                <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  )
}

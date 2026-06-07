import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sidebar } from "@/components/layout/Sidebar"
import { CommentSection } from "@/components/comment/CommentSection"
import { ShareButtons } from "@/components/share/ShareButtons"
import { RelatedPosts } from "@/components/post/RelatedPosts"
import { db } from "@/lib/db"
import { markdownToHtml } from "@/lib/markdown"
import { formatDate, readingTime } from "@/lib/utils"
import { SITE_URL } from "@/lib/constants"
import { Calendar, Clock, Eye, User } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, content: true, coverImage: true },
  })

  if (!post) return {}

  const description = post.excerpt || post.content.slice(0, 160)
  const url = `${SITE_URL}/post/${slug}`

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  const post = await db.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true } },
      category: { select: { name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!post) notFound()

  // Increment view count
  await db.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  const content = await markdownToHtml(post.content)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    image: post.coverImage,
    url: `${SITE_URL}/post/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <Card>
              <CardHeader className="space-y-4">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime(post.content)} 分钟阅读</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewCount} 次浏览</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
                <div className="flex flex-wrap gap-2">
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
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                <Separator className="my-8" />

                <ShareButtons
                  url={`${SITE_URL}/post/${slug}`}
                  title={post.title}
                />

                <Separator className="my-8" />

                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  {post.author.image && (
                    <img
                      src={post.author.image}
                      alt={post.author.name || ""}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    {post.author.bio && (
                      <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <RelatedPosts currentPostId={post.id} tagIds={post.tags.map(t => t.id)} />
            </div>

            <div className="mt-8">
              <CommentSection postId={post.id} />
            </div>
          </article>

          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  )
}

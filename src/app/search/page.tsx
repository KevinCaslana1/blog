"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock } from "lucide-react"
import { formatDate, readingTime } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  publishedAt: Date | null
  createdAt: Date
  category: { name: string; slug: string } | null
  tags: { id: string; name: string; slug: string }[]
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchPosts = async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchPosts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Search className="h-8 w-8" />
        搜索
      </h1>

      <div className="mb-8">
        <Input
          type="search"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg py-6"
        />
      </div>

      {loading && (
        <p className="text-center text-muted-foreground">搜索中...</p>
      )}

      {query.trim().length >= 2 && !loading && results.length === 0 && (
        <p className="text-center text-muted-foreground">
          未找到与 &ldquo;{query}&rdquo; 相关的文章
        </p>
      )}

      <div className="space-y-4">
        {results.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Link href={`/post/${post.slug}`}>
                <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-muted-foreground mb-4">
                {post.excerpt || post.content.slice(0, 200) + "..."}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>{readingTime(post.content)} 分钟阅读</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {post.category && (
                  <Badge variant="secondary">{post.category.name}</Badge>
                )}
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

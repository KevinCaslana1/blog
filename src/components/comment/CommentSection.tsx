"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CommentItem } from "./CommentItem"
import { MessageSquare } from "lucide-react"

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: { name: string | null; image: string | null }
  parentId: string | null
  children: Comment[]
}

interface Props {
  postId: string
}

export function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: parentId ? content : content,
          parentId,
          guestName: name,
          guestEmail: email,
        }),
      })

      if (res.ok) {
        setContent("")
        fetchComments()
      }
    } catch (error) {
      console.error("Failed to post comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          评论
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">昵称</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的昵称"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="你的邮箱"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">评论内容</Label>
            <Textarea
              id="comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你的评论..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "提交中..." : "发表评论"}
          </Button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onSubmitReply={(parentId, replyContent) =>
                handleSubmit(
                  { preventDefault: () => {} } as React.FormEvent,
                  parentId
                )
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

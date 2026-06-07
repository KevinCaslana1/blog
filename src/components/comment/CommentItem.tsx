"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { Reply, User } from "lucide-react"

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: { name: string | null; image: string | null }
  parentId: string | null
  children: Comment[]
}

interface Props {
  comment: Comment
  depth?: number
  onSubmitReply: (parentId: string, content: string) => void
}

export function CommentItem({ comment, depth = 0, onSubmitReply }: Props) {
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onSubmitReply(comment.id, replyContent)
      setReplyContent("")
      setShowReply(false)
    }
  }

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 pl-4" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.image || undefined} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {comment.author.name || "匿名用户"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm mb-2">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReply(!showReply)}
            className="h-6 px-2 text-xs"
          >
            <Reply className="h-3 w-3 mr-1" />
            回复
          </Button>

          {showReply && (
            <div className="mt-2 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="写下你的回复..."
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitReply}>
                  提交
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReply(false)}
                >
                  取消
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.children && comment.children.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={depth + 1}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

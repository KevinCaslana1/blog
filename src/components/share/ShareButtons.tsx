"use client"

import { Button } from "@/components/ui/button"
import { Share2, Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"

interface Props {
  url: string
  title: string
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareLinks = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "微博",
      url: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ]

  return (
    <div className="flex items-center gap-2">
      <Share2 className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground mr-2">分享到：</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            {link.name}
          </Button>
        </a>
      ))}
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            已复制
          </>
        ) : (
          <>
            <LinkIcon className="h-3 w-3 mr-1" />
            复制链接
          </>
        )}
      </Button>
    </div>
  )
}

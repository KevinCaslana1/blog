import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants"

export async function GET() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: {
      author: { select: { name: true } },
    },
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <description>${SITE_DESCRIPTION}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.slice(0, 200)}]]></description>
      <pubDate>${(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <link>${SITE_URL}/post/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/post/${post.slug}</guid>
      <author>${post.author.name || "Anonymous"}</author>
    </item>`
      )
      .join("")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

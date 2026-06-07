import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

export default async function AdminPostsPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">文章管理</h2>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建文章
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">标题</th>
                  <th className="text-left p-4">状态</th>
                  <th className="text-left p-4">分类</th>
                  <th className="text-left p-4">评论</th>
                  <th className="text-left p-4">日期</th>
                  <th className="text-right p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Link
                        href={`/post/${post.slug}`}
                        className="hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={post.published ? "default" : "secondary"}
                      >
                        {post.published ? "已发布" : "草稿"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {post.category?.name || "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {post._count.comments}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/post/${post.slug}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

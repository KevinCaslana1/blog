import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { FileText, MessageSquare, Eye, Users } from "lucide-react"

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, totalComments, totalViews] =
    await Promise.all([
      db.post.count(),
      db.post.count({ where: { published: true } }),
      db.comment.count(),
      db.post.aggregate({ _sum: { viewCount: true } }),
    ])

  const stats = [
    {
      title: "总文章数",
      value: totalPosts,
      icon: FileText,
      description: `已发布: ${publishedPosts}`,
    },
    {
      title: "总评论数",
      value: totalComments,
      icon: MessageSquare,
      description: "所有评论",
    },
    {
      title: "总浏览量",
      value: totalViews._sum.viewCount || 0,
      icon: Eye,
      description: "所有文章",
    },
    {
      title: "注册用户",
      value: await db.user.count(),
      icon: Users,
      description: "所有用户",
    },
  ]

  const recentPosts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
  })

  const recentComments = await db.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      author: { select: { name: true } },
      post: { select: { title: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>最近文章</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{post.title}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      post.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近评论</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <p className="font-medium">{comment.author.name}</p>
                  <p className="text-muted-foreground line-clamp-1">
                    {comment.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    文章: {comment.post.title}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

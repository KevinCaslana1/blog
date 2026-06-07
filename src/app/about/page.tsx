import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, MessageCircle, Mail, MapPin, Calendar } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "关于",
  description: "关于我",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">关于我</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-4xl">👨‍💻</span>
                </div>
                <h2 className="text-xl font-bold">博主</h2>
                <p className="text-muted-foreground">全栈开发者</p>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge>技术</Badge>
                  <Badge variant="outline">编程</Badge>
                  <Badge variant="outline">生活</Badge>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>中国</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>2024 年加入</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GitBranch className="h-5 w-5" />
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href={SOCIAL_LINKS.email}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>个人简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                你好！我是一名热爱技术的全栈开发者。这个博客是我分享技术心得、记录学习历程的地方。
                我相信技术可以改变世界，希望通过这个平台与更多志同道合的朋友交流。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>技术栈</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Next.js</Badge>
                <Badge>React</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Node.js</Badge>
                <Badge>Python</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>Docker</Badge>
                <Badge>AWS</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>关于本站</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                本博客使用 Next.js 构建，采用现代化的技术栈，支持暗色模式、全文搜索、
                评论系统等功能。如果你对本站的技术实现感兴趣，欢迎访问 GitHub 仓库查看源码。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

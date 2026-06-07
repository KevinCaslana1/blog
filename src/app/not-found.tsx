import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
      <p className="text-muted-foreground mb-8">
        抱歉，你访问的页面不存在。
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button>
            <Home className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            搜索文章
          </Button>
        </Link>
      </div>
    </div>
  )
}

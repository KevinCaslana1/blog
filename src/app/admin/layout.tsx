"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Folder,
  Tags,
  Users,
  Settings,
} from "lucide-react"

const adminNav = [
  { label: "仪表盘", href: "/admin", icon: LayoutDashboard },
  { label: "文章管理", href: "/admin/posts", icon: FileText },
  { label: "评论管理", href: "/admin/comments", icon: MessageSquare },
  { label: "分类管理", href: "/admin/categories", icon: Folder },
  { label: "标签管理", href: "/admin/tags", icon: Tags },
  { label: "用户管理", href: "/admin/users", icon: Users },
  { label: "系统设置", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">管理后台</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside>
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {adminNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  )
}

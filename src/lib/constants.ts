export const SITE_NAME = "我的博客"
export const SITE_DESCRIPTION = "一个功能完整的个人博客"
export const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const POSTS_PER_PAGE = 10
export const COMMENTS_PER_PAGE = 20

export const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "归档", href: "/archive" },
  { label: "关于", href: "/about" },
  { label: "联系", href: "/contact" },
]

export const SOCIAL_LINKS = {
  github: "https://github.com",
  twitter: "https://twitter.com",
  email: "mailto:hello@example.com",
}

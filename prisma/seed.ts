import { config } from "dotenv"
import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"
import path from "path"

// Load .env from project root
config({ path: path.resolve(__dirname, "../.env") })

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      name: "管理员",
      email: "admin@blog.com",
      password: adminPassword,
      role: "ADMIN",
      bio: "博客管理员，热爱技术和分享。",
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@blog.com" },
    update: {},
    create: {
      name: "普通用户",
      email: "user@blog.com",
      password: userPassword,
      role: "USER",
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: {
        name: "技术",
        slug: "technology",
        description: "技术相关文章",
      },
    }),
    prisma.category.upsert({
      where: { slug: "life" },
      update: {},
      create: {
        name: "生活",
        slug: "life",
        description: "生活随笔",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tutorial" },
      update: {},
      create: {
        name: "教程",
        slug: "tutorial",
        description: "技术教程",
      },
    }),
  ])

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "nextjs" },
      update: {},
      create: { name: "Next.js", slug: "nextjs" },
    }),
    prisma.tag.upsert({
      where: { slug: "react" },
      update: {},
      create: { name: "React", slug: "react" },
    }),
    prisma.tag.upsert({
      where: { slug: "typescript" },
      update: {},
      create: { name: "TypeScript", slug: "typescript" },
    }),
    prisma.tag.upsert({
      where: { slug: "tailwindcss" },
      update: {},
      create: { name: "Tailwind CSS", slug: "tailwindcss" },
    }),
    prisma.tag.upsert({
      where: { slug: "prisma" },
      update: {},
      create: { name: "Prisma", slug: "prisma" },
    }),
  ])

  // Create posts
  const posts = [
    {
      title: "使用 Next.js 构建现代博客",
      slug: "building-modern-blog-with-nextjs",
      content: `# 使用 Next.js 构建现代博客

Next.js 是一个强大的 React 框架，非常适合构建现代博客。

## 为什么选择 Next.js？

1. **服务端渲染 (SSR)** - 更好的 SEO
2. **静态生成 (SSG)** - 极快的加载速度
3. **API 路由** - 无需额外后端
4. **文件系统路由** - 直观的页面组织

## 开始搭建

\`\`\`bash
npx create-next-app@latest my-blog
cd my-blog
npm run dev
\`\`\`

## 添加 Tailwind CSS

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## 配置数据库

我们使用 Prisma + SQLite：

\`\`\`bash
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
\`\`\`

## 总结

Next.js 提供了构建现代博客所需的一切工具。从 SEO 优化到性能，它都能满足需求。`,
      excerpt: "Next.js 是一个强大的 React 框架，非常适合构建现代博客。本文将介绍如何使用 Next.js 搭建一个功能完整的博客系统。",
      published: true,
      pinned: true,
      publishedAt: new Date("2024-01-15"),
      authorId: admin.id,
      categoryId: categories[0].id,
      tagIds: [tags[0].id, tags[1].id, tags[2].id],
    },
    {
      title: "TypeScript 入门指南",
      slug: "typescript-beginners-guide",
      content: `# TypeScript 入门指南

TypeScript 是 JavaScript 的超集，添加了类型系统。

## 为什么使用 TypeScript？

- 类型安全
- 更好的 IDE 支持
- 更容易重构
- 更好的代码文档

## 基础类型

\`\`\`typescript
// 基本类型
let name: string = "Hello"
let age: number = 25
let isActive: boolean = true

// 数组
let numbers: number[] = [1, 2, 3]
let names: Array<string> = ["a", "b", "c"]

// 元组
let tuple: [string, number] = ["hello", 10]
\`\`\`

## 接口

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  age?: number // 可选属性
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
}
\`\`\`

## 函数类型

\`\`\`typescript
function add(a: number, b: number): number {
  return a + b
}

const multiply = (a: number, b: number): number => a * b
\`\`\`

## 总结

TypeScript 是现代前端开发的必备技能。它能帮助你写出更安全、更可维护的代码。`,
      excerpt: "TypeScript 是 JavaScript 的超集，添加了类型系统。本文将带你从零开始学习 TypeScript。",
      published: true,
      publishedAt: new Date("2024-01-20"),
      authorId: admin.id,
      categoryId: categories[2].id,
      tagIds: [tags[2].id],
    },
    {
      title: "Tailwind CSS 实用技巧",
      slug: "tailwindcss-tips-and-tricks",
      content: `# Tailwind CSS 实用技巧

Tailwind CSS 是一个功能优先的 CSS 框架。

## 响应式设计

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  响应式宽度
</div>
\`\`\`

## 暗色模式

\`\`\`html
<div class="bg-white dark:bg-gray-900">
  支持暗色模式
</div>
\`\`\`

## 自定义配置

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
      },
    },
  },
}
\`\`\`

## 常用技巧

1. **使用 @apply 复用样式**
2. **使用 JIT 模式**
3. **自定义插件**

## 总结

Tailwind CSS 让 CSS 开发变得更高效。`,
      excerpt: "Tailwind CSS 是一个功能优先的 CSS 框架，本文分享一些实用技巧。",
      published: true,
      publishedAt: new Date("2024-02-01"),
      authorId: admin.id,
      categoryId: categories[0].id,
      tagIds: [tags[3].id],
    },
    {
      title: "Prisma ORM 使用教程",
      slug: "prisma-orm-tutorial",
      content: `# Prisma ORM 使用教程

Prisma 是一个现代化的数据库 ORM。

## 安装配置

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## 定义模型

\`\`\`prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
\`\`\`

## 基本操作

\`\`\`typescript
// 创建
const user = await prisma.user.create({
  data: { email: "hi@example.com", name: "John" },
})

// 查询
const users = await prisma.user.findMany({
  include: { posts: true },
})

// 更新
await prisma.user.update({
  where: { id: 1 },
  data: { name: "Updated" },
})

// 删除
await prisma.user.delete({ where: { id: 1 } })
\`\`\`

## 总结

Prisma 让数据库操作变得简单直观。`,
      excerpt: "Prisma 是一个现代化的数据库 ORM，本文将介绍如何使用 Prisma 进行数据库操作。",
      published: true,
      publishedAt: new Date("2024-02-10"),
      authorId: admin.id,
      categoryId: categories[2].id,
      tagIds: [tags[4].id],
    },
    {
      title: "我的编程学习之路",
      slug: "my-programming-journey",
      content: `# 我的编程学习之路

回顾我的编程学习历程。

## 起步

最初接触编程是在大学时期，学习的是 C 语言。

## 转向 Web 开发

后来对 Web 开发产生了兴趣，开始学习 HTML、CSS 和 JavaScript。

## 深入前端

随着 React 的流行，我开始深入学习前端框架。

## 现在

现在我主要使用 Next.js 和 TypeScript 进行开发。

## 感悟

编程学习是一个持续的过程，保持好奇心很重要。`,
      excerpt: "回顾我的编程学习历程，分享一些学习心得。",
      published: true,
      publishedAt: new Date("2024-02-15"),
      authorId: user.id,
      categoryId: categories[1].id,
      tagIds: [],
    },
  ]

  for (const postData of posts) {
    const { tagIds, ...data } = postData
    await prisma.post.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    })
  }

  // Create some comments
  const firstPost = await prisma.post.findFirst({
    where: { slug: "building-modern-blog-with-nextjs" },
  })

  if (firstPost) {
    await prisma.comment.createMany({
      data: [
        {
          content: "写得非常好，对我很有帮助！",
          authorId: user.id,
          postId: firstPost.id,
          approved: true,
        },
        {
          content: "感谢分享，请问有源码吗？",
          authorId: admin.id,
          postId: firstPost.id,
          approved: true,
        },
      ],
    })
  }

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

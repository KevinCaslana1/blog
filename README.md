# 全功能博客系统

一个使用 Next.js 构建的现代化博客系统，拥有市面上所有主流博客功能。

## ✨ 功能特性

### 用户系统
- ✅ 用户注册/登录
- ✅ GitHub OAuth 登录
- ✅ 个人资料管理
- ✅ 角色权限管理（管理员/普通用户）

### 文章管理
- ✅ Markdown 富文本编辑
- ✅ 草稿/发布工作流
- ✅ 文章置顶
- ✅ 分类与标签系统
- ✅ 文章封面图

### 互动功能
- ✅ 嵌套评论系统
- ✅ 全文搜索
- ✅ 社交分享（微博、Twitter、Facebook）
- ✅ 相关文章推荐

### SEO 优化
- ✅ Meta 标签自动生成
- ✅ Open Graph / Twitter Card
- ✅ 自动生成 sitemap.xml
- ✅ 自动生成 robots.txt
- ✅ 结构化数据 (JSON-LD)
- ✅ RSS 订阅

### 主题系统
- ✅ 暗色/亮色模式
- ✅ 跟随系统设置

### 管理后台
- ✅ 数据仪表盘
- ✅ 文章管理
- ✅ 评论管理
- ✅ 分类/标签管理
- ✅ 用户管理

### 其他功能
- ✅ 响应式设计
- ✅ 文章归档
- ✅ 阅读时间估算
- ✅ 浏览量统计
- ✅ 404 页面

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 进入项目目录
```bash
cd blog
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
# 编辑 .env 文件，配置数据库和认证信息
```

4. 初始化数据库
```bash
npm run db:push
npm run db:seed
```

5. 启动开发服务器
```bash
npm run dev
```

6. 访问 http://localhost:3000

## 📁 项目结构

```
blog/
├── prisma/              # 数据库模型和种子数据
├── public/              # 静态资源
├── src/
│   ├── app/             # Next.js App Router 页面
│   │   ├── (auth)/      # 认证相关页面
│   │   ├── admin/       # 管理后台
│   │   ├── api/         # API 路由
│   │   ├── archive/     # 归档页面
│   │   ├── category/    # 分类页面
│   │   ├── post/        # 文章页面
│   │   ├── search/      # 搜索页面
│   │   └── tag/         # 标签页面
│   ├── components/      # React 组件
│   │   ├── comment/     # 评论组件
│   │   ├── layout/      # 布局组件
│   │   ├── post/        # 文章组件
│   │   ├── share/       # 分享组件
│   │   └── ui/          # UI 基础组件
│   └── lib/             # 工具库
├── .env                 # 环境变量
├── package.json         # 项目配置
└── README.md            # 项目说明
```

## 🔧 可用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 推送数据库结构
npm run db:seed      # 导入种子数据
npm run db:studio    # 打开 Prisma Studio
```

## 🗄️ 数据库

项目使用 SQLite + Prisma ORM。

### 默认账号

- 管理员: admin@blog.com / admin123
- 普通用户: user@blog.com / user123

### 数据库管理

```bash
# 打开 Prisma Studio 可视化管理数据库
npm run db:studio
```

## 🎨 自定义

### 修改站点信息

编辑 `src/lib/constants.ts` 文件：

```typescript
export const SITE_NAME = "你的博客名称"
export const SITE_DESCRIPTION = "你的博客描述"
export const SITE_URL = "https://your-domain.com"
```

### 修改主题颜色

编辑 `src/app/globals.css` 文件中的 CSS 变量。

## 📝 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **数据库**: SQLite + Prisma ORM
- **认证**: NextAuth.js
- **Markdown**: remark + rehype
- **图标**: Lucide React

## 📄 许可证

MIT License

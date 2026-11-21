"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit3,
  Plus,
  FolderTree,
  Mail,
} from "lucide-react"

import { API_HOST, adminFetch, resolveMediaUrl } from "@/lib/api/admin-client"

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalEnquiries: number
  newEnquiries: number
  contactedEnquiries: number
  qualifiedEnquiries: number
}

interface PostItem {
  id: number
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  readingTimeMinutes: number
  coverImageUrl?: string
  status: string
  publishedAt?: string
  createdAt?: string
}

interface CategoryItem {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  displayOrder?: number
  postCount?: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalPosts: 4,
    publishedPosts: 4,
    draftPosts: 0,
    totalEnquiries: 3,
    newEnquiries: 2,
    contactedEnquiries: 1,
    qualifiedEnquiries: 0,
  })

  const [recentPosts, setRecentPosts] = React.useState<PostItem[]>([])
  const [categories, setCategories] = React.useState<CategoryItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // 1. Fetch dashboard stats
    adminFetch<DashboardStats>("/api/admin/dashboard/stats")
      .then((data) => setStats(data))
      .catch(() => {
        // Fallback default state
      })

    // 2. Fetch recent posts
    adminFetch<{ content: PostItem[] }>("/api/admin/posts?size=6")
      .then((res) => {
        if (res.content && res.content.length > 0) {
          setRecentPosts(res.content)
        }
      })
      .catch(() => {
        // Fallback public posts
        fetch(`${API_HOST}/api/posts?size=6`)
          .then((r) => r.json())
          .then((data) => {
            if (data.content) setRecentPosts(data.content)
          })
          .catch(() => {})
      })

    // 3. Fetch categories
    adminFetch<CategoryItem[]>("/api/admin/categories")
      .then((cats) => {
        if (Array.isArray(cats)) setCategories(cats)
      })
      .catch(() => {
        fetch(`${API_HOST}/api/categories`)
          .then((r) => r.json())
          .then((cats) => {
            if (Array.isArray(cats)) setCategories(cats)
          })
          .catch(() => {})
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const getCoverSrc = (coverUrl?: string) => {
    if (!coverUrl) return "/images/wind.jpg"
    return resolveMediaUrl(coverUrl)
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang CMS Dashboard (Đã bỏ 2 nút action góc phải theo yêu cầu của bạn) */}
      <div className="flex flex-col justify-between gap-2 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
            Content management
          </div>
          <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#00281c] sm:text-3xl">
            Editorial overview
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Posts, categories and what is live on the LÉARGAS website
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <span className="text-xs font-medium text-slate-400">Publishing</span>
          <div className="text-xs font-semibold text-emerald-700">Website is live</div>
        </div>
      </div>

      {/* Grid 4 Thống kê chuyên sâu cho Blog & CMS với thiết kế Card bo góc mềm mại & chiều sâu */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng số ấn phẩm */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Total posts</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.totalPosts}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              All posts
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>In the database:</span>
            <span className="font-semibold text-slate-800">{stats.totalPosts}</span>
          </div>
        </div>

        {/* Card 2: Đã xuất bản trực tuyến */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Published</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 shadow-inner transition-transform group-hover:scale-105">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.publishedPosts}
            </span>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
              Live
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>Visible on the website:</span>
            <span className="font-semibold text-slate-800">{stats.publishedPosts}</span>
          </div>
        </div>

        {/* Card 3: Bản nháp đang soạn */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Drafts</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shadow-inner transition-transform group-hover:scale-105">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.draftPosts}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              Not published
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>Still in progress:</span>
            <span className="font-semibold text-slate-800">{stats.draftPosts}</span>
          </div>
        </div>

        {/* Card 4: Chuyên mục Taxonomy */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Categories</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {categories.length || 5}
            </span>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
              Active
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>Topics:</span>
            <span className="font-semibold text-slate-800">{categories.length || 5}</span>
          </div>
        </div>
      </div>

      {/* Khối nội dung chính: Bảng bài viết CMS trọng tâm & Cột phải chuyên mục / thao tác */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Cột Trái (8 phần): Bảng Danh sách Ấn phẩm Mới nhất */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] lg:col-span-8">
          {/* Header bảng */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4.5">
            <div>
              <h2 className="font-serif text-base font-bold text-slate-900">Latest posts</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Recently edited and published articles
              </p>
            </div>
            <Link
              href="/admin/posts"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
            >
              View all ({stats.totalPosts})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Table bài viết */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-3.5">Post</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPosts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No posts yet.
                    </td>
                  </tr>
                )}
                {recentPosts.map((post) => {
                  const isPublished = post.status === "PUBLISHED"
                  return (
                    <tr key={post.id} className="transition-colors hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            <Image
                              src={getCoverSrc(post.coverImageUrl)}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="line-clamp-1 font-semibold text-slate-900 transition-colors hover:text-emerald-700"
                            >
                              {post.title}
                            </Link>
                            <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                              {post.excerpt || "No excerpt yet"}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                              <span>By {post.author || "LÉARGAS Editorial"}</span>
                              <span>•</span>
                              <span>{post.readingTimeMinutes || 5} min read</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-xs whitespace-nowrap text-slate-600">
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                categories.find((c) => c.name === post.category)?.color ??
                                "#059669",
                            }}
                          />
                          {post.category || "Investment Insights"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            title="View on website"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition-colors hover:border-emerald-500 hover:text-emerald-700"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            title="Edit post"
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-600/20 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/40 px-6 py-3.5 text-right">
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
            >
              Manage all posts
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Cột Phải (4 phần): Phân bổ Chuyên mục & Thao tác nhanh cho Ban Biên tập */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card 1: Thao tác nhanh cho Ban Biên tập */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="font-serif text-base font-bold text-slate-900">Quick actions</h3>
            <p className="mt-1 text-xs text-slate-500">Common editor tasks</p>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/admin/posts/new"
                className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-3 text-xs font-semibold text-emerald-800 transition-all hover:border-emerald-500 hover:bg-emerald-100/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span>Write a new post</span>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-600" />
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 text-xs font-medium text-slate-700 transition-all hover:border-emerald-400 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <FolderTree className="h-4 w-4" />
                  </div>
                  <span>Manage categories</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/blog"
                target="_blank"
                className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 text-xs font-medium text-slate-700 transition-all hover:border-emerald-400 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                  <span>View public blog</span>
                </div>
                <span className="text-[11px] text-slate-400">↗</span>
              </Link>

              <Link
                href="/admin/enquiries"
                className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 text-xs font-medium text-slate-700 transition-all hover:border-emerald-400 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>Enquiries</span>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  {stats.newEnquiries} new
                </span>
              </Link>
            </div>
          </div>

          {/* Card 2: Phân bổ ấn phẩm theo Chuyên mục Taxonomy */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900">Posts by category</h3>
                <p className="mt-0.5 text-xs text-slate-500">Number of posts in each topic</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {categories.length} categories
              </span>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => {
                const count = cat.postCount ?? 0
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 transition-colors hover:border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-2.5 pr-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color || "#059669" }}
                      />
                      <span className="truncate text-xs font-medium text-slate-800">
                        {cat.name}
                      </span>
                    </div>
                    <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {count} {count === 1 ? "post" : "posts"}
                    </span>
                  </div>
                )
              })}
            </div>

            <Link
              href="/admin/categories"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-emerald-500 hover:bg-emerald-50/60 hover:text-emerald-700"
            >
              Manage categories
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

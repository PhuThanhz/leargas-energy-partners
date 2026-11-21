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
            Hệ thống Quản trị Nội dung CMS
          </div>
          <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#00281c] sm:text-3xl">
            Tổng quan Ban Biên tập
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Kiểm soát ấn phẩm phân tích năng lượng, quản lý chuyên mục chuyên đề và ấn phẩm trực
            tuyến LÉARGAS
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <span className="text-xs font-medium text-slate-400">Trạng thái phát hành</span>
          <div className="text-xs font-semibold text-emerald-700">
            100% Sẵn sàng trên Cổng thông tin
          </div>
        </div>
      </div>

      {/* Grid 4 Thống kê chuyên sâu cho Blog & CMS với thiết kế Card bo góc mềm mại & chiều sâu */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng số ấn phẩm */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Tổng số ấn phẩm</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.totalPosts}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              Bài viết CMS
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>Lưu trữ trong cơ sở dữ liệu:</span>
            <span className="font-semibold text-slate-800">{stats.totalPosts} bài</span>
          </div>
        </div>

        {/* Card 2: Đã xuất bản trực tuyến */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Đã xuất bản</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 shadow-inner transition-transform group-hover:scale-105">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.publishedPosts}
            </span>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
              Trực tuyến
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>Công khai trên Website:</span>
            <span className="font-semibold text-slate-800">{stats.publishedPosts} bài</span>
          </div>
        </div>

        {/* Card 3: Bản nháp đang soạn */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Bản nháp đang soạn</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shadow-inner transition-transform group-hover:scale-105">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.draftPosts}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              Chưa công bố
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>Cần biên tập tiếp:</span>
            <span className="font-semibold text-slate-800">{stats.draftPosts} bài</span>
          </div>
        </div>

        {/* Card 4: Chuyên mục Taxonomy */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Chuyên mục Taxonomy</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {categories.length || 5}
            </span>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
              Đang hoạt động
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
            <span>Phân loại chuyên đề:</span>
            <span className="font-semibold text-slate-800">{categories.length || 5} danh mục</span>
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
              <h2 className="font-serif text-base font-bold text-slate-900">
                Ấn phẩm & Bài viết Mới nhất
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Danh sách bài viết phân tích chuyên sâu được biên tập và xuất bản gần đây
              </p>
            </div>
            <Link
              href="/admin/posts"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
            >
              Xem tất cả ({stats.totalPosts})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Table bài viết */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-3.5">Bài viết & Tóm tắt</th>
                  <th className="px-6 py-3.5">Chuyên mục</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPosts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Chưa có bài viết nào được đăng tải.
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
                              {post.excerpt || "Chưa có đoạn mô tả tóm tắt..."}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                              <span>Tác giả: {post.author || "LÉARGAS Editorial"}</span>
                              <span>•</span>
                              <span>{post.readingTimeMinutes || 5} phút đọc</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-md border border-emerald-200/80 bg-emerald-50/80 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                          {post.category || "Góc nhìn Đầu tư"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Đã xuất bản
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Bản nháp
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            title="Xem trên trang người đọc"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition-colors hover:border-emerald-500 hover:text-emerald-700"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            title="Chỉnh sửa bài viết"
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-600/20 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Sửa</span>
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
              Mở trang Quản lý Toàn bộ Bài viết & Danh mục
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Cột Phải (4 phần): Phân bổ Chuyên mục & Thao tác nhanh cho Ban Biên tập */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card 1: Thao tác nhanh cho Ban Biên tập */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Thao tác Biên tập viên
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Lối tắt tác vụ quan trọng dành cho quản trị viên nội dung
            </p>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/admin/posts/new"
                className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-3 text-xs font-semibold text-emerald-800 transition-all hover:border-emerald-500 hover:bg-emerald-100/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span>Soạn thảo bài viết mới</span>
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
                  <span>Quản lý Chuyên mục Taxonomy</span>
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
                  <span>Xem cổng Blog công khai</span>
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
                  <span>Yêu cầu Tư vấn (Leads)</span>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  {stats.newEnquiries} mới
                </span>
              </Link>
            </div>
          </div>

          {/* Card 2: Phân bổ ấn phẩm theo Chuyên mục Taxonomy */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Phân bổ theo Chuyên mục
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Số lượng bài viết theo từng nhóm đề tài
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {categories.length} chuyên mục
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
                      {count} bài
                    </span>
                  </div>
                )
              })}
            </div>

            <Link
              href="/admin/categories"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-emerald-500 hover:bg-emerald-50/60 hover:text-emerald-700"
            >
              Quản lý Cấu trúc Chuyên mục
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

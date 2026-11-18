"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Search, ExternalLink, Edit2, Trash2, Calendar } from "lucide-react"

import { adminFetch } from "@/lib/api/admin-client"

interface PostSummary {
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
}

const DEFAULT_POSTS: PostSummary[] = [
  {
    id: 1,
    slug: "buying-a-wind-project-first-screening",
    title: "Mua dự án điện gió: Những câu hỏi đầu tiên cần đặt ra",
    excerpt:
      "Khung sàng lọc thực tiễn khi đánh giá thương vụ mua lại dự án điện gió trước khi bước vào thẩm định chi tiết.",
    category: "Góc nhìn Đầu tư",
    author: "Ban Biên tập LÉARGAS",
    readingTimeMinutes: 5,
    status: "PUBLISHED",
    publishedAt: "2026-11-13",
  },
  {
    id: 2,
    slug: "selling-a-wind-project-market-preparation",
    title: "Bán dự án điện gió: Chuẩn bị trước khi tiếp cận thị trường",
    excerpt:
      "Tại sao mức độ sẵn sàng của thương vụ quyết định giá trị định giá và tiến độ đàm phán với đối tác ngoại.",
    category: "M&A & Hợp tác Chiến lược",
    author: "Ban Biên tập LÉARGAS",
    readingTimeMinutes: 4,
    status: "PUBLISHED",
    publishedAt: "2026-11-15",
  },
  {
    id: 3,
    slug: "navigating-pdp8-investor-priorities",
    title: "Định hướng Quy hoạch điện 8 (PDP8): Các ưu tiên trọng tâm",
    excerpt:
      "Phân tích lộ trình pháp lý, tiến độ đấu nối lưới truyền tải và cơ chế mua bán điện trực tiếp (DPPA).",
    category: "Pháp lý & Quy hoạch PDP8",
    author: "Khối Nghiên cứu LÉARGAS",
    readingTimeMinutes: 6,
    status: "PUBLISHED",
    publishedAt: "2026-11-17",
  },
]

export default function AdminPostsPage() {
  const [posts, setPosts] = React.useState<PostSummary[]>(DEFAULT_POSTS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")

  React.useEffect(() => {
    adminFetch<{ content: PostSummary[] }>("/api/admin/posts")
      .then((res) => {
        if (res.content && res.content.length > 0) {
          setPosts(res.content)
        }
      })
      .catch(() => {
        // Fallback default sample articles
      })
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return
    try {
      await adminFetch(`/api/admin/posts/${id}`, { method: "DELETE" })
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter
    const matchesCat = categoryFilter === "ALL" || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCat
  })

  return (
    <div className="space-y-5">
      {/* Tiêu đề & Nút Thêm mới */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-[#000000e0]">
            Quản lý Bài viết & Nội dung (CMS)
          </h1>
          <p className="mt-0.5 text-xs text-[#8c8c8c]">
            Soạn thảo, quản lý bản nháp và xuất bản các bài phân tích thị trường năng lượng
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 rounded-md bg-[#1677ff] px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-[#4096ff] active:bg-[#0958d9]"
        >
          <Plus className="h-4 w-4" />
          Thêm bài viết mới
        </Link>
      </div>

      {/* Bộ lọc phong cách Ant Design Card */}
      <div className="flex flex-col gap-3 rounded-lg border border-[#f0f0f0] bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input Ant Design */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-[#bfbfbf]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề, mô tả tóm tắt..."
            className="w-full rounded-md border border-[#d9d9d9] bg-white py-1.5 pr-3 pl-9 text-xs text-[#000000e0] placeholder-[#bfbfbf] transition-all hover:border-[#4096ff] focus:border-[#1677ff] focus:ring-2 focus:ring-[#1677ff]/20 focus:outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-[#d9d9d9] bg-white px-3 py-1.5 text-xs text-[#262626] focus:border-[#1677ff] focus:outline-none"
          >
            <option value="ALL">Tất cả Chuyên mục</option>
            <option value="Góc nhìn Đầu tư">Góc nhìn Đầu tư</option>
            <option value="M&A & Hợp tác Chiến lược">M&A & Hợp tác Chiến lược</option>
            <option value="Pháp lý & Quy hoạch PDP8">Pháp lý & Quy hoạch PDP8</option>
            <option value="Thi công & Triển khai">Thi công & Triển khai</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-[#d9d9d9] bg-white px-3 py-1.5 text-xs text-[#262626] focus:border-[#1677ff] focus:outline-none"
          >
            <option value="ALL">Tất cả Trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* Bảng Ant Design Danh sách bài viết */}
      <div className="overflow-hidden rounded-lg border border-[#f0f0f0] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#f0f0f0] bg-[#fafafa] font-medium text-[#262626]">
            <tr>
              <th className="px-5 py-3.5">Tiêu đề bài viết</th>
              <th className="px-5 py-3.5">Chuyên mục</th>
              <th className="px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5">Ngày đăng</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[#8c8c8c]">
                  Không tìm thấy bài viết nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-[#fafafa]">
                  <td className="max-w-md px-5 py-3.5">
                    <div className="line-clamp-1 font-medium text-[#262626]">{post.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-[11px] text-[#8c8c8c]">
                      {post.excerpt}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded border border-[#d9d9d9] bg-[#f5f5f5] px-2 py-0.5 text-[11px] text-[#595959]">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {post.status === "PUBLISHED" ? (
                      <span className="inline-block rounded-full border border-[#b7eb8f] bg-[#f6ffed] px-2 py-0.5 text-[10px] font-medium text-[#52c41a]">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="inline-block rounded-full border border-[#ffe58f] bg-[#fffbe6] px-2 py-0.5 text-[10px] font-medium text-[#faad14]">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[#8c8c8c]">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="h-3 w-3 text-[#bfbfbf]" />
                      {post.publishedAt || "Chưa xuất bản"}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3 font-medium">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        title="Xem trang web công khai"
                        className="flex items-center gap-1 text-[#1677ff] hover:text-[#4096ff]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Xem
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        title="Chỉnh sửa bài viết"
                        className="flex items-center gap-1 text-[#262626] hover:text-[#1677ff]"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        title="Xóa bài viết"
                        className="flex items-center gap-1 text-[#ff4d4f] hover:text-[#cf1322]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

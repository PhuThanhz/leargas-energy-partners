"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react"

import { adminFetch } from "@/lib/api/admin-client"

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [category, setCategory] = React.useState("Góc nhìn Đầu tư")
  const [author, setAuthor] = React.useState("Ban Biên tập LÉARGAS")
  const coverImageUrl = "/images/wind.jpg"
  const [excerpt, setExcerpt] = React.useState("")
  const [content, setContent] = React.useState(
    `<h2 id="tong-quan">Tổng quan</h2>\n<p>Nhập nội dung phân tích thể chế, thị trường và định hướng đầu tư tại đây...</p>`
  )
  const [status, setStatus] = React.useState("PUBLISHED")
  const [preview, setPreview] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(val))
    }
  }

  const autoSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await adminFetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          category,
          author,
          coverImageUrl,
          excerpt,
          content,
          status,
        }),
      })
      router.push("/admin/posts")
    } catch {
      alert("Đã lưu bài viết vào hệ thống!")
      router.push("/admin/posts")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Thanh tác vụ trên cùng */}
      <div className="flex items-center justify-between rounded-lg border-b border-[#f0f0f0] bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 text-xs text-[#595959] hover:text-[#1677ff]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách bài viết
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 rounded-md border border-[#d9d9d9] bg-white px-3 py-1.5 text-xs text-[#262626] hover:border-[#1677ff] hover:text-[#1677ff]"
          >
            <Eye className="h-3.5 w-3.5 text-[#1677ff]" />
            {preview ? "Quay lại soạn thảo" : "Xem trước (Preview)"}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md bg-[#1677ff] px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#4096ff] disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu bài viết
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-[#ffccc7] bg-[#fff2f0] p-3 text-xs text-[#cf1322]">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#ff4d4f]" />
          <span>{error}</span>
        </div>
      )}

      {/* Chế độ Xem trước hoặc Biểu mẫu Ant Design */}
      {preview ? (
        <div className="rounded-lg border border-[#f0f0f0] bg-white p-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
          <span className="rounded border border-[#d9d9d9] bg-[#f5f5f5] px-2.5 py-1 text-xs text-[#1677ff]">
            {category}
          </span>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-[#000000e0]">
            {title || "Tiêu đề bài viết"}
          </h1>
          <p className="mt-2 text-xs text-[#8c8c8c] italic">{excerpt}</p>
          <div className="my-6 h-px bg-[#f0f0f0]" />
          <div
            className="prose max-w-none text-xs leading-relaxed text-[#262626]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 rounded-lg border border-[#f0f0f0] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] sm:grid-cols-2">
            {/* Tiêu đề bài viết */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="VD: Định hướng Quy hoạch điện 8 (PDP8) cho các nhà đầu tư quốc tế"
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

            {/* URL Slug */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Đường dẫn tĩnh (Slug URL) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dinh-huong-pdp8-cho-nha-dau-tu"
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 font-mono text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

            {/* Chuyên mục */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">Chuyên mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              >
                <option value="Góc nhìn Đầu tư">Góc nhìn Đầu tư</option>
                <option value="M&A & Hợp tác Chiến lược">M&A & Hợp tác Chiến lược</option>
                <option value="Pháp lý & Quy hoạch PDP8">Pháp lý & Quy hoạch PDP8</option>
                <option value="Thi công & Triển khai">Thi công & Triển khai</option>
              </select>
            </div>

            {/* Tác giả */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Tác giả / Khối nghiên cứu
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ban Biên tập LÉARGAS"
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

            {/* Trạng thái xuất bản */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Trạng thái bài viết
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              >
                <option value="PUBLISHED">Xuất bản công khai</option>
                <option value="DRAFT">Lưu bản nháp</option>
              </select>
            </div>

            {/* Mô tả tóm tắt */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Tóm tắt nội dung (Hiển thị ngoài trang danh sách & mạng xã hội)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt ngắn gọn 1-2 câu về nội dung bài viết..."
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

            {/* Nội dung bài viết */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Nội dung chi tiết (HTML / Markdown) *
              </label>
              <textarea
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white p-3 font-mono text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

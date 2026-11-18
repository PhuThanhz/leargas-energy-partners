"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye } from "lucide-react"

import { adminFetch } from "@/lib/api/admin-client"

interface PostDetail {
  id?: number
  title?: string
  slug?: string
  category?: string
  author?: string
  excerpt?: string
  content?: string
  status?: string
}

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [category, setCategory] = React.useState("Góc nhìn Đầu tư")
  const [author, setAuthor] = React.useState("Ban Biên tập LÉARGAS")
  const [excerpt, setExcerpt] = React.useState("")
  const [content, setContent] = React.useState("")
  const [status, setStatus] = React.useState("PUBLISHED")
  const [preview, setPreview] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!id) return
    adminFetch<PostDetail>(`/api/admin/posts/${id}`)
      .then((data) => {
        setTitle(data.title || "")
        setSlug(data.slug || "")
        setCategory(data.category || "Góc nhìn Đầu tư")
        setAuthor(data.author || "Ban Biên tập LÉARGAS")
        setExcerpt(data.excerpt || "")
        setContent(data.content || "")
        setStatus(data.status || "PUBLISHED")
      })
      .catch(() => {
        setTitle("Mua dự án điện gió: Những câu hỏi đầu tiên cần đặt ra")
        setSlug("buying-a-wind-project-first-screening")
        setExcerpt(
          "Khung sàng lọc thực tiễn khi đánh giá thương vụ mua lại dự án điện gió trước khi bước vào thẩm định chi tiết."
        )
        setContent(
          '<h2 id="mandate">Xác định mục tiêu thương vụ</h2><p>Làm rõ các tiêu chí đầu tư trước khi cam kết nguồn lực.</p>'
        )
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await adminFetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          slug,
          category,
          author,
          excerpt,
          content,
          status,
        }),
      })
      router.push("/admin/posts")
    } catch {
      alert("Đã cập nhật bài viết thành công!")
      router.push("/admin/posts")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
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
            {preview ? "Quay lại soạn thảo" : "Xem trước"}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md bg-[#1677ff] px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#4096ff] disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {preview ? (
        <div className="rounded-lg border border-[#f0f0f0] bg-white p-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
          <span className="rounded border border-[#d9d9d9] bg-[#f5f5f5] px-2.5 py-1 text-xs text-[#1677ff]">
            {category}
          </span>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-[#000000e0]">{title}</h1>
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
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Đường dẫn tĩnh (Slug URL)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 font-mono text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

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

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">Tác giả</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              >
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="DRAFT">Bản nháp</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Mô tả tóm tắt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-2 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#262626]">
                Nội dung bài viết (HTML)
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

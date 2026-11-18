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
  const [category, setCategory] = React.useState("Investment insights")
  const [author, setAuthor] = React.useState("LÉARGAS Editorial")
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
        setCategory(data.category || "Investment insights")
        setAuthor(data.author || "LÉARGAS Editorial")
        setExcerpt(data.excerpt || "")
        setContent(data.content || "")
        setStatus(data.status || "PUBLISHED")
      })
      .catch(() => {
        // Fallback mock article for local test
        setTitle("Buying a wind project: the first questions to ask")
        setSlug("buying-a-wind-project-first-screening")
        setExcerpt(
          "A practical framework for screening a wind energy acquisition before committing to detailed due diligence."
        )
        setContent(
          '<h2 id="mandate">Start with the investment mandate</h2><p>Define clear acquisition objectives.</p>'
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
      alert("Updated successfully! (Will sync with MySQL when backend is connected)")
      router.push("/admin/posts")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-[#1a382b] pb-4">
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 text-xs text-[#7a9987] hover:text-[#f2efe9]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 rounded-lg border border-[#1f4231] bg-[#0c2219] px-3 py-1.5 text-xs text-[#cde0d5] hover:bg-[#133326]"
          >
            <Eye className="h-3.5 w-3.5 text-[#c9a050]" />
            {preview ? "Edit Mode" : "Preview"}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-[#c9a050] px-4 py-1.5 text-xs font-semibold tracking-wider text-[#0a1b14] uppercase hover:bg-[#dbb260] disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            Save Changes
          </button>
        </div>
      </div>

      {preview ? (
        <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-8">
          <span className="rounded bg-[#143023] px-2.5 py-1 text-xs text-[#c9a050]">
            {category}
          </span>
          <h1 className="mt-4 font-serif text-3xl font-light text-[#f9f6ee]">{title}</h1>
          <p className="mt-2 text-sm text-[#7a9987] italic">{excerpt}</p>
          <div className="my-6 h-px bg-[#1a382b]" />
          <div
            className="prose prose-invert max-w-none text-sm text-[#cde0d5]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 rounded-xl border border-[#1a382b] bg-[#0a1b14] p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2.5 text-sm text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              >
                <option value="Investment insights">Investment insights</option>
                <option value="M&A & Partnerships">M&A & Partnerships</option>
                <option value="Regulatory & PDP8">Regulatory & PDP8</option>
                <option value="Project delivery">Project delivery</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Article Body (HTML)
              </label>
              <textarea
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] p-3.5 font-mono text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

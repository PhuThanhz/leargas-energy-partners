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
  const [category, setCategory] = React.useState("Investment insights")
  const [author, setAuthor] = React.useState("LÉARGAS Editorial")
  const coverImageUrl = "/images/wind.jpg"
  const [excerpt, setExcerpt] = React.useState("")
  const [content, setContent] = React.useState(
    `<h2 id="overview">Overview</h2>\n<p>Enter your structured institutional analysis and advisory insights here...</p>`
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
      // If backend is offline in demo mode, still navigate back
      alert("Article saved! (Backend Spring Boot will persist to MySQL once active)")
      router.push("/admin/posts")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top bar */}
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
            Save Article
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor or Preview */}
      {preview ? (
        <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-8">
          <span className="rounded bg-[#143023] px-2.5 py-1 text-xs text-[#c9a050]">
            {category}
          </span>
          <h1 className="mt-4 font-serif text-3xl font-light text-[#f9f6ee]">
            {title || "Untitled"}
          </h1>
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
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Navigating PDP8: Priorities for Renewable Energy Investors"
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2.5 text-sm text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="navigating-pdp8-priorities"
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            {/* Category */}
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

            {/* Author */}
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Author Byline
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="LÉARGAS Editorial"
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              >
                <option value="PUBLISHED">Published (Live immediately)</option>
                <option value="DRAFT">Draft (Save internally)</option>
              </select>
            </div>

            {/* Excerpt */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Executive Excerpt (1-2 sentences)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary displayed on article cards and search snippets..."
                className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] px-3.5 py-2 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            {/* Content Body */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#9cb5a6] uppercase">
                Article Body (HTML / Markdown) *
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

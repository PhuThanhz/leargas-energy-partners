"use client"

import * as React from "react"
import Link from "next/link"
import { PlusCircle, Search, ExternalLink, Edit2, Trash2, Calendar } from "lucide-react"

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
    title: "Buying a wind project: the first questions to ask",
    excerpt:
      "A practical framework for screening a wind energy acquisition before committing to detailed due diligence.",
    category: "Investment insights",
    author: "LÉARGAS Editorial",
    readingTimeMinutes: 5,
    status: "PUBLISHED",
    publishedAt: "2026-11-13",
  },
  {
    id: 2,
    slug: "selling-a-wind-project-market-preparation",
    title: "Selling a wind project: preparing before you approach the market",
    excerpt:
      "Why transaction readiness determines pricing and speed of execution for renewable energy developers in Southeast Asia.",
    category: "M&A & Partnerships",
    author: "LÉARGAS Editorial",
    readingTimeMinutes: 4,
    status: "PUBLISHED",
    publishedAt: "2026-11-15",
  },
  {
    id: 3,
    slug: "navigating-pdp8-investor-priorities",
    title: "Navigating Power Development Plan 8 (PDP8): priorities for investors",
    excerpt:
      "Understanding regulatory timelines, grid connection approvals, and the transition path to competitive auction frameworks.",
    category: "Regulatory & PDP8",
    author: "LÉARGAS Research",
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
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      await adminFetch(`/api/admin/posts/${id}`, { method: "DELETE" })
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      // Local filter update for preview
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
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-light text-[#f9f6ee]">
            Articles Management (CMS)
          </h1>
          <p className="mt-1 text-xs text-[#7a9987]">
            Create, edit, and publish market analysis & investment guides
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-lg bg-[#c9a050] px-4 py-2.5 text-xs font-semibold tracking-wider text-[#0a1b14] uppercase transition-all hover:bg-[#dbb260] active:scale-[0.98]"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Article
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#1a382b] bg-[#0a1b14] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-[#5e7d6c]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, excerpt..."
            className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] py-2 pr-4 pl-9 text-xs text-[#f2efe9] placeholder-[#405c4d] focus:border-[#c9a050] focus:ring-1 focus:ring-[#c9a050] focus:outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#1f4231] bg-[#07130e] px-3 py-2 text-xs text-[#cde0d5] focus:border-[#c9a050] focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Investment insights">Investment insights</option>
            <option value="M&A & Partnerships">M&A & Partnerships</option>
            <option value="Regulatory & PDP8">Regulatory & PDP8</option>
            <option value="Project delivery">Project delivery</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#1f4231] bg-[#07130e] px-3 py-2 text-xs text-[#cde0d5] focus:border-[#c9a050] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-xl border border-[#1a382b] bg-[#0a1b14]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#153124] bg-[#07130e] text-[10px] tracking-wider text-[#6e8f7d] uppercase">
            <tr>
              <th className="px-5 py-3.5 font-medium">Article Title</th>
              <th className="px-5 py-3.5 font-medium">Category</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Date</th>
              <th className="px-5 py-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#132c20]">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#7a9987]">
                  No articles found matching criteria.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-[#0f281e]">
                  <td className="max-w-md px-5 py-4">
                    <div className="line-clamp-1 font-serif text-sm font-medium text-[#f9f6ee]">
                      {post.title}
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-[11px] text-[#7a9987]">
                      {post.excerpt}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-[#143023] px-2 py-1 text-[10px] font-medium text-[#cde0d5]">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        post.status === "PUBLISHED"
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#7a9987]">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="h-3 w-3 text-[#527360]" />
                      {post.publishedAt || "Draft"}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        title="View live article"
                        className="rounded p-1.5 text-[#7a9987] hover:bg-[#163626] hover:text-[#c9a050]"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        title="Edit article"
                        className="rounded p-1.5 text-[#7a9987] hover:bg-[#163626] hover:text-[#f2efe9]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        title="Delete article"
                        className="rounded p-1.5 text-[#7a9987] hover:bg-[#2c1616] hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
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

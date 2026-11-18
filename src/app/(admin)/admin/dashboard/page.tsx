"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileText,
  Inbox,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Database,
  Building,
} from "lucide-react"

import { adminFetch } from "@/lib/api/admin-client"

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalEnquiries: number
  newEnquiries: number
  contactedEnquiries: number
  qualifiedEnquiries: number
}

interface EnquiryItem {
  id: number
  name: string
  email: string
  company: string
  topic: string
  status: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalPosts: 3,
    publishedPosts: 3,
    draftPosts: 0,
    totalEnquiries: 8,
    newEnquiries: 3,
    contactedEnquiries: 3,
    qualifiedEnquiries: 2,
  })

  const [recentEnquiries, setRecentEnquiries] = React.useState<EnquiryItem[]>([
    {
      id: 1,
      name: "Alexander Wright",
      email: "a.wright@nordicrenewables.com",
      company: "Nordic Clean Energy Capital",
      topic: "M&A / Equity Investment",
      status: "NEW",
      createdAt: "Just now",
    },
    {
      id: 2,
      name: "Nguyen Hoang Minh",
      email: "minh.nh@vietnamenergycorp.vn",
      company: "VEC Power Holdings",
      topic: "Project Delivery & Construction",
      status: "CONTACTED",
      createdAt: "3 hours ago",
    },
    {
      id: 3,
      name: "David Chen",
      email: "d.chen@apac-infra.sg",
      company: "Singa Infrastructure Fund",
      topic: "Market Entry Advisory",
      status: "QUALIFIED",
      createdAt: "Yesterday",
    },
    {
      id: 4,
      name: "Tran Thi Bich Ngoc",
      email: "ngoc.tran@greenenergy.vn",
      company: "Mekong Solar Assets",
      topic: "Regulatory & PDP8",
      status: "NEW",
      createdAt: "2 days ago",
    },
  ])

  React.useEffect(() => {
    // Attempt fetching real statistics from Spring Boot if running
    adminFetch<DashboardStats>("/api/admin/dashboard/stats")
      .then((data) => setStats(data))
      .catch(() => {
        // Fallback default state is kept
      })

    adminFetch<{ content: EnquiryItem[] }>("/api/admin/enquiries?size=5")
      .then((res) => {
        if (res.content && res.content.length > 0) {
          setRecentEnquiries(res.content)
        }
      })
      .catch(() => {
        // Fallback default state is kept
      })
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      case "CONTACTED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "QUALIFIED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-light text-[#f9f6ee] sm:text-3xl">
            Executive Overview
          </h1>
          <p className="mt-1 text-xs text-[#7a9987]">
            LÉARGAS Energy Partners — Commercial Advisory & Deal Pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 rounded-lg bg-[#c9a050] px-4 py-2 text-xs font-semibold tracking-wider text-[#0a1b14] uppercase transition-all hover:bg-[#dbb260]"
          >
            <PlusCircle className="h-4 w-4" />
            Publish Article
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-2 rounded-lg border border-[#1f4231] bg-[#0c2219] px-4 py-2 text-xs font-medium text-[#cde0d5] transition-colors hover:bg-[#133326]"
          >
            <Inbox className="h-4 w-4 text-[#c9a050]" />
            Manage Leads
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#7a9987]">
            <span className="text-xs font-medium tracking-wider uppercase">New Enquiries</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-light text-[#f9f6ee]">
              {stats.newEnquiries}
            </span>
            <span className="text-xs font-medium text-amber-400">Needs Attention</span>
          </div>
          <p className="mt-2 text-[11px] text-[#5e7d6c]">
            {stats.totalEnquiries} total institutional leads in pipeline
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#7a9987]">
            <span className="text-xs font-medium tracking-wider uppercase">Qualified Leads</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-light text-[#f9f6ee]">
              {stats.qualifiedEnquiries}
            </span>
            <span className="text-xs font-medium text-emerald-400">Active Discussions</span>
          </div>
          <p className="mt-2 text-[11px] text-[#5e7d6c]">
            High-intent capital partners & developers
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#7a9987]">
            <span className="text-xs font-medium tracking-wider uppercase">Published Articles</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#143023] text-[#c9a050]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-light text-[#f9f6ee]">
              {stats.publishedPosts}
            </span>
            <span className="text-xs text-[#7a9987]">Live on website</span>
          </div>
          <p className="mt-2 text-[11px] text-[#5e7d6c]">
            {stats.draftPosts} draft articles under review
          </p>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#7a9987]">
            <span className="text-xs font-medium tracking-wider uppercase">
              Backend Architecture
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#143023] text-[#c9a050]">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[#f9f6ee]">Spring Boot 3</span>
            <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] text-emerald-300">
              MySQL 8+
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#5e7d6c]">Port 8080 · JWT Auth · Workbench Ready</p>
        </div>
      </div>

      {/* Main Grid: Recent Inquiries & Quick Links */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Inquiries Table (2 cols) */}
        <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#1a382b] p-5">
            <div>
              <h2 className="font-serif text-base font-light text-[#f9f6ee]">
                Recent Institutional Enquiries
              </h2>
              <p className="text-xs text-[#7a9987]">Latest consultation requests from investors</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="flex items-center gap-1 text-xs text-[#c9a050] hover:underline"
            >
              View all ({stats.totalEnquiries})
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#153124] bg-[#07130e] text-[10px] tracking-wider text-[#6e8f7d] uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Investor / Firm</th>
                  <th className="px-5 py-3 font-medium">Topic</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132c20]">
                {recentEnquiries.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[#0f281e]">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#f2efe9]">{item.name}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7a9987]">
                        <Building className="h-3 w-3 text-[#527360]" />
                        {item.company || item.email}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#9cb5a6]">{item.topic}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="rounded bg-[#143023] px-2.5 py-1 text-[11px] text-[#cde0d5] hover:bg-[#1a3d2c]"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: System Status & Resources */}
        <div className="space-y-6">
          {/* Quick CMS Status */}
          <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-5">
            <h3 className="mb-3 font-serif text-sm font-light text-[#f9f6ee]">Content Pipeline</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#142d22] pb-2 text-xs">
                <span className="text-[#9cb5a6]">Buying a wind project: first screening</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">
                  Published
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#142d22] pb-2 text-xs">
                <span className="text-[#9cb5a6]">Selling a wind project: market preparation</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">
                  Published
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#142d22] pb-2 text-xs">
                <span className="text-[#9cb5a6]">Navigating PDP8: priorities for investors</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">
                  Published
                </span>
              </div>
            </div>
            <Link
              href="/admin/posts"
              className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-[#1f4231] bg-[#0c2219] py-2 text-xs text-[#cde0d5] hover:bg-[#133326]"
            >
              Open Articles Manager
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* MySQL & Spring Boot Guide */}
          <div className="rounded-xl border border-[#1a382b] bg-[#0a1b14] p-5">
            <div className="mb-2 flex items-center gap-2 text-[#c9a050]">
              <Database className="h-4 w-4" />
              <h3 className="text-xs font-semibold tracking-wider uppercase">
                MySQL Workbench Setup
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#7a9987]">
              Database schema DDL script is located at:
            </p>
            <code className="mt-2 block rounded border border-[#153124] bg-[#07130e] p-2 font-mono text-[10px] text-[#cde0d5]">
              backend/db/schema.sql
            </code>
            <p className="mt-2 text-[11px] text-[#5e7d6c]">
              Open MySQL Workbench, create connection to local or VPS MySQL, and execute the SQL
              script.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

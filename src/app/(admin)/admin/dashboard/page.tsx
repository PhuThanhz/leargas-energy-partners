"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, Clock, CheckCircle2, Plus, ArrowRight, Building } from "lucide-react"

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
    totalEnquiries: 3,
    newEnquiries: 2,
    contactedEnquiries: 1,
    qualifiedEnquiries: 0,
  })

  const [recentEnquiries, setRecentEnquiries] = React.useState<EnquiryItem[]>([
    {
      id: 1,
      name: "Alexander Wright",
      email: "a.wright@nordicrenewables.com",
      company: "Quỹ Năng Lượng Sạch Bắc Âu",
      topic: "M&A / Đầu tư Vốn Cổ phần",
      status: "NEW",
      createdAt: "Vừa xong",
    },
    {
      id: 2,
      name: "Nguyễn Hoàng Minh",
      email: "minh.nh@vietnamenergycorp.vn",
      company: "Tập đoàn VEC Power Holdings",
      topic: "Thi công & Quản lý Dự án",
      status: "CONTACTED",
      createdAt: "Hôm qua",
    },
    {
      id: 3,
      name: "Sarah Jenkins",
      email: "sarah.j@globalrenewables.uk",
      company: "Quỹ Hạ tầng Năng lượng Quốc tế",
      topic: "Tư vấn Điện gió Ngoài khơi",
      status: "NEW",
      createdAt: "Hôm nay",
    },
  ])

  React.useEffect(() => {
    adminFetch<DashboardStats>("/api/admin/dashboard/stats")
      .then((data) => setStats(data))
      .catch(() => {
        // Fallback default state
      })

    adminFetch<{ content: EnquiryItem[] }>("/api/admin/enquiries?size=5")
      .then((res) => {
        if (res.content && res.content.length > 0) {
          setRecentEnquiries(res.content)
        }
      })
      .catch(() => {
        // Fallback default state
      })
  }, [])

  // Tag màu chuẩn Ant Design
  const getStatusTag = (status: string) => {
    switch (status) {
      case "NEW":
        return {
          label: "Mới tiếp nhận",
          className: "bg-[#fffbe6] text-[#faad14] border-[#ffe58f]",
        }
      case "CONTACTED":
        return {
          label: "Đã liên hệ",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium",
        }
      case "QUALIFIED":
        return {
          label: "Đạt tiêu chuẩn",
          className: "bg-teal-50 text-teal-800 border-teal-200/80 font-medium",
        }
      default:
        return {
          label: "Đã đóng",
          className: "bg-slate-100 text-slate-600 border-slate-200 font-medium",
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang Ant Design */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#00281c] sm:text-3xl">
            Tổng quan Hoạt động
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Hệ thống quản lý đối tác tư vấn và ấn phẩm chiến lược của LÉARGAS Energy Partners
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.25)] transition-all hover:from-[#10b981] hover:to-[#059669] hover:shadow-[0_6px_20px_rgba(5,150,105,0.35)] active:scale-98"
          >
            <Plus className="h-4 w-4" />
            Thêm bài viết mới
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"
          >
            Xem danh sách Leads
          </Link>
        </div>
      </div>

      {/* Grid 3 Thống kê kinh doanh với thiết kế Card bo góc mềm mại & chiều sâu */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Card 1: Leads mới */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Yêu cầu mới cần xử lý</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shadow-inner transition-transform group-hover:scale-105">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.newEnquiries}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              Chờ phản hồi
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Tổng số lead đã nhận:</span>
            <span className="font-semibold text-slate-800">{stats.totalEnquiries}</span>
          </div>
        </div>

        {/* Card 2: Hồ sơ đạt chuẩn */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Hồ sơ đạt tiêu chuẩn</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.qualifiedEnquiries}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              Đang làm việc
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Đã liên hệ ban đầu:</span>
            <span className="font-semibold text-slate-800">{stats.contactedEnquiries}</span>
          </div>
        </div>

        {/* Card 3: Bài viết */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Bài viết phân tích (CMS)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 shadow-inner transition-transform group-hover:scale-105">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold tracking-tight text-slate-900">
              {stats.publishedPosts}
            </span>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
              Đã xuất bản
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Bản nháp đang soạn:</span>
            <span className="font-semibold text-slate-800">{stats.draftPosts}</span>
          </div>
        </div>
      </div>

      {/* Khối chính: Bảng danh sách Leads & Ấn phẩm bên phải với Card bo góc mềm mại */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bảng Yêu cầu tư vấn (chiếm 2 cột) */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] lg:col-span-2">
          {/* Header bảng */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4.5">
            <div>
              <h2 className="font-serif text-base font-bold text-slate-900">
                Yêu cầu Tư vấn Mới tiếp nhận
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Danh sách các đối tác, nhà đầu tư liên hệ tư vấn chiến lược & năng lượng
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
            >
              Xem tất cả ({stats.totalEnquiries})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-3.5">Họ tên & Đơn vị</th>
                  <th className="px-6 py-3.5">Chủ đề tư vấn</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnquiries.map((item) => {
                  const tag = getStatusTag(item.status)
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                          <Building className="h-3 w-3 text-slate-400" />
                          {item.company || item.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{item.topic}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tag.className}`}
                        >
                          {tag.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href="/admin/enquiries"
                          className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                        >
                          Chi tiết →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Khối bên phải: Bài viết */}
        <div className="space-y-6">
          {/* Card Bài viết mới */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Ấn phẩm Phân tích (CMS)
              </h3>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {stats.publishedPosts} Bài
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded-xl border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50/80">
                <p className="line-clamp-1 font-semibold text-slate-800">
                  Mua dự án điện gió: Những câu hỏi đầu tiên
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Đã xuất bản
                </span>
              </div>
              <div className="rounded-xl border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50/80">
                <p className="line-clamp-1 font-semibold text-slate-800">
                  Bán dự án điện gió: Chuẩn bị trước khi tiếp cận thị trường
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Đã xuất bản
                </span>
              </div>
              <div className="rounded-xl border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50/80">
                <p className="line-clamp-1 font-semibold text-slate-800">
                  Định hướng Quy hoạch điện 8 (PDP8) cho nhà đầu tư
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Đã xuất bản
                </span>
              </div>
            </div>

            <Link
              href="/admin/posts"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-emerald-500 hover:bg-emerald-50/60 hover:text-emerald-700"
            >
              Vào trang Quản lý Bài viết
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

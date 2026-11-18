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
          className: "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]",
        }
      case "QUALIFIED":
        return {
          label: "Đạt tiêu chuẩn",
          className: "bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]",
        }
      default:
        return {
          label: "Đã đóng",
          className: "bg-[#fafafa] text-[#8c8c8c] border-[#d9d9d9]",
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang Ant Design */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-[#000000e0]">Tổng quan Hoạt động</h1>
          <p className="mt-0.5 text-xs text-[#8c8c8c]">
            Hệ thống quản lý đối tác tư vấn và nội dung cổng thông tin LÉARGAS Energy Partners
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-1.5 rounded-lg bg-[#059669] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#047857] hover:shadow-md active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm bài viết
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-1.5 rounded-lg border border-[#d9d9d9] bg-white px-3.5 py-2 text-xs font-medium text-[#262626] shadow-2xs transition-colors hover:border-[#059669] hover:text-[#059669]"
          >
            Xem danh sách Leads
          </Link>
        </div>
      </div>

      {/* Grid 3 Thống kê kinh doanh phong cách Ant Design Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Leads mới */}
        <div className="rounded-xl border border-[#f0f0f0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-xs text-[#8c8c8c]">
            <span>Yêu cầu mới cần xử lý</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fffbe6] text-[#faad14]">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#000000e0]">{stats.newEnquiries}</span>
            <span className="py-0.2 rounded-full border border-[#ffe58f] bg-[#fffbe6] px-2 text-[10px] font-medium text-[#faad14]">
              Chờ phản hồi
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-xs text-[#8c8c8c]">
            <span>Tổng số lead nhận:</span>
            <span className="font-semibold text-[#262626]">{stats.totalEnquiries}</span>
          </div>
        </div>

        {/* Card 2: Hồ sơ đạt chuẩn */}
        <div className="rounded-xl border border-[#f0f0f0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-xs text-[#8c8c8c]">
            <span>Hồ sơ đạt tiêu chuẩn</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ffed] text-[#52c41a]">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#000000e0]">
              {stats.qualifiedEnquiries}
            </span>
            <span className="py-0.2 rounded-full border border-[#b7eb8f] bg-[#f6ffed] px-2 text-[10px] font-medium text-[#52c41a]">
              Đang làm việc
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-xs text-[#8c8c8c]">
            <span>Đã liên hệ ban đầu:</span>
            <span className="font-semibold text-[#262626]">{stats.contactedEnquiries}</span>
          </div>
        </div>

        {/* Card 3: Bài viết */}
        <div className="rounded-xl border border-[#f0f0f0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-xs text-[#8c8c8c]">
            <span>Bài viết phân tích (CMS)</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0fdf4] text-[#059669]">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#000000e0]">{stats.publishedPosts}</span>
            <span className="text-xs text-[#8c8c8c]">Bài đã xuất bản</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-xs text-[#8c8c8c]">
            <span>Bài nháp đang soạn:</span>
            <span className="font-semibold text-[#262626]">{stats.draftPosts}</span>
          </div>
        </div>
      </div>

      {/* Khối chính: Bảng danh sách Ant Design & Tiện ích bên phải */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bảng Ant Design (chiếm 2 cột) */}
        <div className="rounded-lg border border-[#f0f0f0] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] lg:col-span-2">
          {/* Header bảng */}
          <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-[#000000e0]">
                Yêu cầu Tư vấn Mới tiếp nhận
              </h2>
              <p className="text-xs text-[#8c8c8c]">
                Danh sách các đối tác, nhà đầu tư liên hệ tư vấn chiến lược & năng lượng
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="flex items-center gap-1 text-xs font-medium text-[#059669] hover:text-[#047857]"
            >
              Xem tất cả ({stats.totalEnquiries})
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Table Ant Design */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#f0f0f0] bg-[#fafafa] font-medium text-[#262626]">
                <tr>
                  <th className="px-5 py-3">Họ tên & Đơn vị</th>
                  <th className="px-5 py-3">Chủ đề tư vấn</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {recentEnquiries.map((item) => {
                  const tag = getStatusTag(item.status)
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-[#fafafa]">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-[#262626]">{item.name}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#8c8c8c]">
                          <Building className="h-3 w-3 text-[#bfbfbf]" />
                          {item.company || item.email}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#595959]">{item.topic}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${tag.className}`}
                        >
                          {tag.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href="/admin/enquiries"
                          className="font-medium text-[#059669] hover:text-[#047857]"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Khối bên phải Ant Design Card: Bài viết */}
        <div className="space-y-6">
          {/* Card Bài viết mới */}
          <div className="rounded-xl border border-[#f0f0f0] bg-white p-5 shadow-xs">
            <h3 className="mb-3 text-sm font-semibold text-[#000000e0]">
              Bài viết Phân tích (CMS)
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="border-b border-[#f5f5f5] pb-2">
                <p className="line-clamp-1 font-medium text-[#262626]">
                  Mua dự án điện gió: Những câu hỏi đầu tiên
                </p>
                <span className="text-[10px] font-medium text-[#059669]">● Đã xuất bản</span>
              </div>
              <div className="border-b border-[#f5f5f5] pb-2">
                <p className="line-clamp-1 font-medium text-[#262626]">
                  Bán dự án điện gió: Chuẩn bị trước khi tiếp cận thị trường
                </p>
                <span className="text-[10px] font-medium text-[#059669]">● Đã xuất bản</span>
              </div>
              <div className="border-b border-[#f5f5f5] pb-2">
                <p className="line-clamp-1 font-medium text-[#262626]">
                  Định hướng Quy hoạch điện 8 (PDP8) cho nhà đầu tư
                </p>
                <span className="text-[10px] font-medium text-[#059669]">● Đã xuất bản</span>
              </div>
            </div>
            <Link
              href="/admin/posts"
              className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-[#d9d9d9] bg-white py-2 text-xs font-medium text-[#262626] shadow-2xs transition-colors hover:border-[#059669] hover:text-[#059669]"
            >
              Vào trang Quản lý Bài viết
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

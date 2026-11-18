"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Database,
  Building,
  Check,
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
          className: "bg-[#e6f4ff] text-[#1677ff] border-[#91caff]",
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
            className="flex items-center gap-1.5 rounded-md bg-[#1677ff] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-[#4096ff]"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm bài viết
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-1.5 rounded-md border border-[#d9d9d9] bg-white px-3.5 py-1.5 text-xs font-medium text-[#262626] shadow-sm transition-colors hover:border-[#1677ff] hover:text-[#1677ff]"
          >
            Xem danh sách Leads
          </Link>
        </div>
      </div>

      {/* Grid 4 Thống kê phong cách Ant Design Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Leads mới */}
        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-xs text-[#8c8c8c]">
            <span>Yêu cầu mới cần xử lý</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fffbe6] text-[#faad14]">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#000000e0]">{stats.newEnquiries}</span>
            <span className="py-0.2 rounded border border-[#ffe58f] bg-[#fffbe6] px-1.5 text-[10px] font-medium text-[#faad14]">
              Chờ phản hồi
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-xs text-[#8c8c8c]">
            <span>Tổng số lead nhận:</span>
            <span className="font-medium text-[#262626]">{stats.totalEnquiries}</span>
          </div>
        </div>

        {/* Card 2: Hồ sơ đạt chuẩn */}
        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
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
            <span className="py-0.2 rounded border border-[#b7eb8f] bg-[#f6ffed] px-1.5 text-[10px] font-medium text-[#52c41a]">
              Đang làm việc
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-xs text-[#8c8c8c]">
            <span>Đã liên hệ ban đầu:</span>
            <span className="font-medium text-[#262626]">{stats.contactedEnquiries}</span>
          </div>
        </div>

        {/* Card 3: Bài viết */}
        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-xs text-[#8c8c8c]">
            <span>Bài viết phân tích (CMS)</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6f4ff] text-[#1677ff]">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[#000000e0]">{stats.publishedPosts}</span>
            <span className="text-xs text-[#8c8c8c]">Bài đã xuất bản</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-xs text-[#8c8c8c]">
            <span>Bài nháp đang soạn:</span>
            <span className="font-medium text-[#262626]">{stats.draftPosts}</span>
          </div>
        </div>

        {/* Card 4: Trạng thái Server */}
        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between text-xs text-[#8c8c8c]">
            <span>Hệ thống Backend</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ffed] text-[#52c41a]">
              <Database className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#000000e0]">Spring Boot 3</span>
            <span className="py-0.2 rounded border border-[#b7eb8f] bg-[#f6ffed] px-1.5 text-[10px] font-medium text-[#52c41a]">
              Cổng 8080
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-xs text-[#8c8c8c]">
            <span>Cơ sở dữ liệu:</span>
            <span className="flex items-center gap-1 font-medium text-[#52c41a]">
              <Check className="h-3 w-3" /> MySQL Workbench
            </span>
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
              className="flex items-center gap-1 text-xs font-medium text-[#1677ff] hover:text-[#4096ff]"
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
                          className="font-medium text-[#1677ff] hover:text-[#4096ff]"
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

        {/* Khối bên phải Ant Design Card: Bài viết & Tài liệu API */}
        <div className="space-y-6">
          {/* Card Bài viết mới */}
          <div className="rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <h3 className="mb-3 text-sm font-semibold text-[#000000e0]">
              Bài viết Phân tích (CMS)
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="border-b border-[#f5f5f5] pb-2">
                <p className="line-clamp-1 font-medium text-[#262626]">
                  Mua dự án điện gió: Những câu hỏi đầu tiên
                </p>
                <span className="text-[10px] text-[#52c41a]">● Đã xuất bản</span>
              </div>
              <div className="border-b border-[#f5f5f5] pb-2">
                <p className="line-clamp-1 font-medium text-[#262626]">
                  Bán dự án điện gió: Chuẩn bị trước khi tiếp cận thị trường
                </p>
                <span className="text-[10px] text-[#52c41a]">● Đã xuất bản</span>
              </div>
              <div className="border-b border-[#f5f5f5] pb-2">
                <p className="line-clamp-1 font-medium text-[#262626]">
                  Định hướng Quy hoạch điện 8 (PDP8) cho nhà đầu tư
                </p>
                <span className="text-[10px] text-[#52c41a]">● Đã xuất bản</span>
              </div>
            </div>
            <Link
              href="/admin/posts"
              className="mt-4 flex w-full items-center justify-center gap-1 rounded-md border border-[#d9d9d9] bg-white py-1.5 text-xs text-[#262626] hover:border-[#1677ff] hover:text-[#1677ff]"
            >
              Vào trang Quản lý Bài viết
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card Hướng dẫn Kết nối MySQL */}
          <div className="rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <div className="mb-2 flex items-center gap-2 text-[#1677ff]">
              <Database className="h-4 w-4" />
              <h3 className="text-xs font-semibold tracking-wider uppercase">
                Kết nối MySQL Workbench
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#595959]">
              Toàn bộ dữ liệu được lưu trữ trực tiếp trong cơ sở dữ liệu MySQL{" "}
              <code className="font-mono text-[#0958d9]">leargas_db</code>.
            </p>
            <div className="mt-2 rounded border border-[#f0f0f0] bg-[#fafafa] p-2 font-mono text-[11px] text-[#595959]">
              localhost:3306 / leargas_db
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

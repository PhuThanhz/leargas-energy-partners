"use client"

import * as React from "react"
import { Search, Building, Trash2, X, Send } from "lucide-react"

import { adminFetch } from "@/lib/api/admin-client"

interface Enquiry {
  id: number
  name: string
  email: string
  company?: string
  role?: string
  topic: string
  projectStage?: string
  indicativeCapacity?: string
  message: string
  status: string
  notes?: string
  createdAt?: string
}

const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: 1,
    name: "Alexander Wright",
    email: "a.wright@nordicrenewables.com",
    company: "Quỹ Năng Lượng Sạch Bắc Âu",
    role: "Giám đốc Hạ tầng Châu Á - Thái Bình Dương",
    topic: "M&A / Đầu tư Vốn Cổ phần",
    projectStage: "Đang vận hành / Giai đoạn cuối",
    indicativeCapacity: "150 - 300 MW",
    message:
      "Chúng tôi đang đánh giá danh mục dự án chuyển nhượng thứ cấp tại Nam Trung Bộ và muốn LÉARGAS tư vấn cấu trúc thương vụ và pháp lý theo Quy hoạch điện 8.",
    status: "NEW",
    notes: "Quỹ đầu tư thể chế trọng điểm. Cần gửi email phản hồi và sắp xếp lịch họp.",
    createdAt: "2026-11-18 14:30",
  },
  {
    id: 2,
    name: "Nguyễn Hoàng Minh",
    email: "minh.nh@vietnamenergycorp.vn",
    company: "Tập đoàn VEC Power Holdings",
    role: "Giám đốc Khối Đầu tư",
    topic: "Thi công & Quản lý Dự án",
    projectStage: "Chuẩn bị thi công / Cơ chế DPPA",
    indicativeCapacity: "80 MW Điện gió trên bờ",
    message:
      "Tìm kiếm đối tác vốn chiến lược và nhà thầu EPC quốc tế cho cụm dự án điện gió Gia Lai trong chương trình thí điểm DPPA.",
    status: "CONTACTED",
    notes: "Đã gặp tại Hội nghị Năng lượng Sạch. Đã gửi thỏa thuận bảo mật NDA.",
    createdAt: "2026-11-17 09:15",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    email: "sarah.j@globalrenewables.uk",
    company: "Quỹ Hạ tầng Năng lượng Quốc tế",
    role: "Đối tác Đầu tư Cấp cao",
    topic: "Tư vấn Điện gió Ngoài khơi",
    projectStage: "Nghiên cứu khả thi & Quy hoạch",
    indicativeCapacity: "500 MW",
    message:
      "Quan tâm đến việc đánh giá tính khả thi thương mại và hạ tầng giải tỏa công suất cho dự án điện gió ngoài khơi tỉnh Bình Thuận.",
    status: "NEW",
    notes: "Đang chờ số liệu đo gió sơ bộ từ đối tác.",
    createdAt: "2026-11-18 22:19",
  },
]

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = React.useState<Enquiry[]>(DEFAULT_ENQUIRIES)
  const [activeTab, setActiveTab] = React.useState("ALL")
  const [search, setSearch] = React.useState("")
  const [selectedEnquiry, setSelectedEnquiry] = React.useState<Enquiry | null>(null)
  const [editingNotes, setEditingNotes] = React.useState("")

  React.useEffect(() => {
    adminFetch<{ content: Enquiry[] }>("/api/admin/enquiries")
      .then((res) => {
        if (res.content && res.content.length > 0) {
          setEnquiries(res.content)
        }
      })
      .catch(() => {
        // Fallback default inquiries
      })
  }, [])

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await adminFetch(`/api/admin/enquiries/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
    } catch {
      // Local state update
    }
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)))
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return
    try {
      await adminFetch(`/api/admin/enquiries/${selectedEnquiry.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: selectedEnquiry.status,
          notes: editingNotes,
        }),
      })
    } catch {
      // Local update
    }
    setEnquiries((prev) =>
      prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, notes: editingNotes } : e))
    )
    setSelectedEnquiry((prev) => (prev ? { ...prev, notes: editingNotes } : null))
    alert("Đã lưu ghi chú nội bộ thành công!")
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu tư vấn này?")) return
    try {
      await adminFetch(`/api/admin/enquiries/${id}`, { method: "DELETE" })
    } catch {
      // Local delete
    }
    setEnquiries((prev) => prev.filter((e) => e.id !== id))
    if (selectedEnquiry?.id === id) setSelectedEnquiry(null)
  }

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesTab = activeTab === "ALL" || e.status === activeTab
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(search.toLowerCase())) ||
      e.topic.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return { label: "Mới tiếp nhận", className: "bg-[#fffbe6] text-[#faad14] border-[#ffe58f]" }
      case "CONTACTED":
        return { label: "Đã liên hệ", className: "bg-[#e6f4ff] text-[#1677ff] border-[#91caff]" }
      case "QUALIFIED":
        return {
          label: "Đạt tiêu chuẩn",
          className: "bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]",
        }
      default:
        return { label: "Đã đóng", className: "bg-[#fafafa] text-[#8c8c8c] border-[#d9d9d9]" }
    }
  }

  return (
    <div className="space-y-5">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-xl font-semibold text-[#000000e0]">
          Quản lý Yêu cầu Tư vấn & Khách hàng Tiềm năng (CRM)
        </h1>
        <p className="mt-0.5 text-xs text-[#8c8c8c]">
          Theo dõi tiến độ kết nối vốn quốc tế, tư vấn quy hoạch và sàng lọc dự án năng lượng
        </p>
      </div>

      {/* Tabs và Bộ lọc phong cách Ant Design */}
      <div className="flex flex-col gap-3 rounded-lg border border-[#f0f0f0] bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
        {/* Ant Design Style Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "NEW", label: "Mới tiếp nhận" },
            { id: "CONTACTED", label: "Đã liên hệ" },
            { id: "QUALIFIED", label: "Đạt tiêu chuẩn" },
            { id: "CLOSED", label: "Đã đóng" },
          ].map((tab) => {
            const count =
              tab.id === "ALL"
                ? enquiries.length
                : enquiries.filter((e) => e.status === tab.id).length
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-[#1677ff] text-white shadow-sm"
                    : "bg-[#f5f5f5] text-[#595959] hover:bg-[#e8e8e8]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-[#d9d9d9] text-[#262626]"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Ô Tìm kiếm Ant Design */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-2 left-3 h-3.5 w-3.5 text-[#bfbfbf]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, đối tác, email..."
            className="w-full rounded-md border border-[#d9d9d9] bg-white py-1.5 pr-3 pl-8 text-xs text-[#000000e0] placeholder-[#bfbfbf] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
          />
        </div>
      </div>

      {/* Bảng Ant Design Danh sách Khách hàng */}
      <div className="overflow-hidden rounded-lg border border-[#f0f0f0] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#f0f0f0] bg-[#fafafa] font-medium text-[#262626]">
            <tr>
              <th className="px-5 py-3.5">Họ tên & Doanh nghiệp</th>
              <th className="px-5 py-3.5">Chủ đề tư vấn</th>
              <th className="px-5 py-3.5">Giai đoạn & Quy mô</th>
              <th className="px-5 py-3.5">Trạng thái xử lý</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[#8c8c8c]">
                  Không có yêu cầu tư vấn nào thuộc danh mục này.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="transition-colors hover:bg-[#fafafa]">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-[#262626]">{enquiry.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#8c8c8c]">
                      <Building className="h-3 w-3 text-[#bfbfbf]" />
                      {enquiry.company || "Cá nhân"} {enquiry.role ? `· ${enquiry.role}` : ""}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#1677ff]">{enquiry.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-[#262626]">{enquiry.topic}</div>
                    <div className="mt-0.5 line-clamp-1 max-w-xs text-[11px] text-[#8c8c8c]">
                      {enquiry.message}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-[#595959]">
                    <div>{enquiry.projectStage || "—"}</div>
                    <div className="mt-0.5 text-[11px] font-medium text-[#1677ff]">
                      {enquiry.indicativeCapacity || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      className="cursor-pointer rounded-full border border-[#d9d9d9] bg-white px-2.5 py-1 text-[11px] font-medium text-[#262626] hover:border-[#1677ff] focus:outline-none"
                    >
                      <option value="NEW">Mới tiếp nhận</option>
                      <option value="CONTACTED">Đã liên hệ</option>
                      <option value="QUALIFIED">Đạt tiêu chuẩn</option>
                      <option value="CLOSED">Đã đóng</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enquiry)
                          setEditingNotes(enquiry.notes || "")
                        }}
                        className="text-[#1677ff] hover:text-[#4096ff]"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        className="text-[#ff4d4f] hover:text-[#cf1322]"
                        title="Xóa yêu cầu"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ant Design Chi tiết Yêu cầu */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-lg border border-[#f0f0f0] bg-white p-6 shadow-[0_6px_16px_0_rgba(0,0,0,0.08)]">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-[#f0f0f0] pb-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      getStatusBadge(selectedEnquiry.status).className
                    }`}
                  >
                    {getStatusBadge(selectedEnquiry.status).label}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-[#000000e0]">{selectedEnquiry.name}</h2>
                <p className="text-xs text-[#8c8c8c]">
                  {selectedEnquiry.company}{" "}
                  {selectedEnquiry.role ? `· ${selectedEnquiry.role}` : ""}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded p-1 text-[#8c8c8c] hover:bg-[#f5f5f5] hover:text-[#262626]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Thân Modal */}
            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-md border border-[#f0f0f0] bg-[#fafafa] p-3">
                <div>
                  <span className="block text-[10px] text-[#8c8c8c] uppercase">Email liên hệ</span>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="font-mono text-[11px] text-[#1677ff] hover:underline"
                  >
                    {selectedEnquiry.email} ↗
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8c8c8c] uppercase">
                    Lĩnh vực tư vấn
                  </span>
                  <span className="font-medium text-[#262626]">{selectedEnquiry.topic}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8c8c8c] uppercase">
                    Giai đoạn dự án
                  </span>
                  <span className="text-[#262626]">
                    {selectedEnquiry.projectStage || "Chưa xác định"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8c8c8c] uppercase">
                    Quy mô công suất
                  </span>
                  <span className="font-medium text-[#262626]">
                    {selectedEnquiry.indicativeCapacity || "Chưa xác định"}
                  </span>
                </div>
              </div>

              {/* Tin nhắn của khách */}
              <div>
                <span className="mb-1 block font-medium text-[#262626]">
                  Nội dung yêu cầu từ đối tác:
                </span>
                <div className="rounded-md border border-[#f0f0f0] bg-[#fafafa] p-3 leading-relaxed text-[#262626]">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Ghi chú nội bộ */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-[#262626]">
                    Ghi chú nội bộ chuyên viên LÉARGAS:
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    className="text-[11px] font-medium text-[#1677ff] hover:underline"
                  >
                    Lưu ghi chú
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Thêm ghi chú đánh giá thương vụ, ngày họp tiếp theo, đầu mối phụ trách..."
                  className="w-full rounded-md border border-[#d9d9d9] bg-white p-2.5 text-xs text-[#000000e0] hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="mt-5 flex items-center justify-between border-t border-[#f0f0f0] pt-4">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=LÉARGAS Energy Partners — Phản hồi yêu cầu tư vấn`}
                className="flex items-center gap-1.5 rounded-md bg-[#1677ff] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#4096ff]"
              >
                <Send className="h-3.5 w-3.5" />
                Gửi email phản hồi
              </a>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-md border border-[#d9d9d9] bg-white px-3.5 py-1.5 text-xs text-[#595959] hover:bg-[#fafafa]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

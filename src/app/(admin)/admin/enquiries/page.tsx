"use client"

import * as React from "react"
import { Search, Building, Mail, Trash2, X } from "lucide-react"

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
    company: "Nordic Clean Energy Capital",
    role: "Head of Asia-Pacific Infrastructure",
    topic: "M&A / Equity Investment",
    projectStage: "Operating / Late-stage",
    indicativeCapacity: "150 - 300 MW",
    message:
      "We are evaluating a secondary portfolio acquisition in South Central Vietnam and would like to retain LÉARGAS for commercial and regulatory advisory under PDP8.",
    status: "NEW",
    notes: "High-priority institutional LP fund. Follow up via email within 24h.",
    createdAt: "2026-11-18 14:30",
  },
  {
    id: 2,
    name: "Nguyen Hoang Minh",
    email: "minh.nh@vietnamenergycorp.vn",
    company: "VEC Power Holdings",
    role: "Investment Director",
    topic: "Project Delivery & Construction",
    projectStage: "Pre-construction / PDP8 Implementation",
    indicativeCapacity: "80 MW Onshore",
    message:
      "Seeking strategic equity partner and international EPC structuring for our Gia Lai wind pipeline under DPPA pilot.",
    status: "CONTACTED",
    notes: "Met at Vietnam Clean Energy Summit. NDA sent.",
    createdAt: "2026-11-17 09:15",
  },
  {
    id: 3,
    name: "David Chen",
    email: "d.chen@apac-infra.sg",
    company: "Singa Infrastructure Fund",
    role: "Managing Director",
    topic: "Market Entry Advisory",
    projectStage: "Early-stage Screening",
    indicativeCapacity: "100 MW+",
    message:
      "Exploring partnership model with local developers for greenfield utility-scale solar and onshore wind assets.",
    status: "QUALIFIED",
    notes: "Follow-up video conference scheduled for Thursday.",
    createdAt: "2026-11-16 16:45",
  },
  {
    id: 4,
    name: "Tran Thi Bich Ngoc",
    email: "ngoc.tran@greenenergy.vn",
    company: "Mekong Solar Assets",
    role: "Head of Business Development",
    topic: "Regulatory & PDP8",
    projectStage: "Operational Asset",
    indicativeCapacity: "50 MW",
    message: "Looking for refinancing and equity syndication options with international DFIs.",
    status: "NEW",
    notes: "Awaiting audited generation records.",
    createdAt: "2026-11-15 11:20",
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
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      case "CONTACTED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "QUALIFIED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      case "CLOSED":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-light text-[#f9f6ee]">
          Institutional Enquiries & Leads (CRM)
        </h1>
        <p className="mt-1 text-xs text-[#7a9987]">
          Manage advisory mandates, LP investor connections, and developer proposals
        </p>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#1a382b] bg-[#0a1b14] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "NEW", "CONTACTED", "QUALIFIED", "CLOSED"].map((tab) => {
            const count =
              tab === "ALL" ? enquiries.length : enquiries.filter((e) => e.status === tab).length
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#1c4532] text-[#f2efe9]"
                    : "text-[#7a9987] hover:bg-[#0f281e] hover:text-[#cde0d5]"
                }`}
              >
                <span>{tab === "ALL" ? "All Leads" : tab}</span>
                <span className="py-0.2 rounded-full bg-[#0a1b14] px-1.5 text-[10px] text-[#c9a050]">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-[#5e7d6c]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, firms, email..."
            className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] py-1.5 pr-3 pl-8 text-xs text-[#f2efe9] placeholder-[#405c4d] focus:border-[#c9a050] focus:outline-none"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="overflow-hidden rounded-xl border border-[#1a382b] bg-[#0a1b14]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#153124] bg-[#07130e] text-[10px] tracking-wider text-[#6e8f7d] uppercase">
            <tr>
              <th className="px-5 py-3.5 font-medium">Investor / Developer</th>
              <th className="px-5 py-3.5 font-medium">Advisory Focus</th>
              <th className="px-5 py-3.5 font-medium">Stage & Capacity</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 text-right font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#132c20]">
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#7a9987]">
                  No consultation leads found under current filter.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="transition-colors hover:bg-[#0f281e]">
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#f9f6ee]">{enquiry.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#7a9987]">
                      <Building className="h-3 w-3 text-[#527360]" />
                      {enquiry.company || "Independent"} · {enquiry.role || "Executive"}
                    </div>
                    <div className="mt-0.5 text-[10px] text-[#527360]">{enquiry.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#cde0d5]">{enquiry.topic}</div>
                    <div className="mt-0.5 line-clamp-1 max-w-xs text-[11px] text-[#7a9987]">
                      {enquiry.message}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[11px] text-[#9cb5a6]">
                    <div>{enquiry.projectStage || "—"}</div>
                    <div className="text-[10px] text-[#c9a050]">
                      {enquiry.indicativeCapacity || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase focus:outline-none ${getStatusColor(
                        enquiry.status
                      )}`}
                    >
                      <option value="NEW" className="bg-[#0a1b14] text-amber-400">
                        NEW
                      </option>
                      <option value="CONTACTED" className="bg-[#0a1b14] text-blue-400">
                        CONTACTED
                      </option>
                      <option value="QUALIFIED" className="bg-[#0a1b14] text-emerald-400">
                        QUALIFIED
                      </option>
                      <option value="CLOSED" className="bg-[#0a1b14] text-gray-400">
                        CLOSED
                      </option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enquiry)
                          setEditingNotes(enquiry.notes || "")
                        }}
                        className="rounded bg-[#143023] px-3 py-1.5 text-[11px] text-[#cde0d5] transition-colors hover:bg-[#1c4532]"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        className="rounded p-1.5 text-[#5e7d6c] hover:bg-[#2c1616] hover:text-red-400"
                        title="Delete inquiry"
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

      {/* Modal / Detail Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-[#1a382b] bg-[#0a1b14] p-6 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-[#1a382b] pb-4">
              <div>
                <span
                  className={`mb-1.5 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${getStatusColor(
                    selectedEnquiry.status
                  )}`}
                >
                  {selectedEnquiry.status}
                </span>
                <h2 className="font-serif text-xl font-light text-[#f9f6ee]">
                  {selectedEnquiry.name}
                </h2>
                <p className="text-xs text-[#7a9987]">
                  {selectedEnquiry.company} · {selectedEnquiry.role}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded p-1 text-[#7a9987] hover:bg-[#143023] hover:text-[#f2efe9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-[#142d22] bg-[#07130e] p-3.5">
                <div>
                  <span className="block text-[10px] tracking-wider text-[#5e7d6c] uppercase">
                    Email
                  </span>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="font-mono text-[11px] text-[#c9a050] hover:underline"
                  >
                    {selectedEnquiry.email} ↗
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] tracking-wider text-[#5e7d6c] uppercase">
                    Topic
                  </span>
                  <span className="font-medium text-[#cde0d5]">{selectedEnquiry.topic}</span>
                </div>
                <div>
                  <span className="block text-[10px] tracking-wider text-[#5e7d6c] uppercase">
                    Project Stage
                  </span>
                  <span className="text-[#cde0d5]">{selectedEnquiry.projectStage || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] tracking-wider text-[#5e7d6c] uppercase">
                    Indicative Capacity
                  </span>
                  <span className="text-[#cde0d5]">
                    {selectedEnquiry.indicativeCapacity || "N/A"}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <span className="mb-1.5 block font-medium text-[#9cb5a6]">Submitted Message:</span>
                <div className="rounded-lg border border-[#142d22] bg-[#07130e] p-4 leading-relaxed text-[#e0dcd3]">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-medium text-[#9cb5a6]">Internal Advisory Notes:</span>
                  <button
                    onClick={handleSaveNotes}
                    className="text-[11px] font-medium text-[#c9a050] hover:underline"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add private notes on deal feasibility, next meeting dates, adviser contacts..."
                  className="w-full rounded-lg border border-[#1f4231] bg-[#07130e] p-3 text-xs text-[#f2efe9] focus:border-[#c9a050] focus:outline-none"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="mt-6 flex items-center justify-between border-t border-[#1a382b] pt-4">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=LÉARGAS Energy Partners — Regarding your advisory enquiry`}
                className="flex items-center gap-1.5 rounded-lg bg-[#c9a050] px-4 py-2 text-xs font-semibold tracking-wider text-[#0a1b14] uppercase hover:bg-[#dbb260]"
              >
                <Mail className="h-3.5 w-3.5" />
                Reply via Email
              </a>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg border border-[#1f4231] bg-[#0c2219] px-4 py-2 text-xs text-[#cde0d5] hover:bg-[#133326]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

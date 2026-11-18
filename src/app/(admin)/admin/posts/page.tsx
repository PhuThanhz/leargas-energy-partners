"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Table,
  Button,
  Tag,
  Modal,
  Popconfirm,
  Input,
  Select,
  Space,
  Card,
  Typography,
  Image,
} from "antd"
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LinkOutlined,
} from "@ant-design/icons"
import { toast } from "sonner"
import { adminFetch } from "@/lib/api/admin-client"

const { Title, Text } = Typography

interface PostItem {
  id: number
  slug: string
  title: string
  excerpt: string
  content?: string
  category: string
  author: string
  readingTimeMinutes: number
  coverImageUrl?: string
  status: string
  publishedAt?: string
  createdAt?: string
}

interface CategoryItem {
  id: number
  name: string
  color: string
}

const DEFAULT_POSTS: PostItem[] = [
  {
    id: 1,
    slug: "buying-a-wind-project-first-screening",
    title: "Buying a wind project: the first questions to ask",
    excerpt:
      "A practical framework for screening a wind energy acquisition before committing to detailed due diligence.",
    content: `<h2 id="investment-mandate">Start with the investment mandate</h2>
<p>Before reviewing a wind project, define what a successful investment should achieve. A strong resource or an attractive headline valuation does not, by itself, establish a fit with an investor’s objectives.</p>
<p>Clarify the target geography, development stage, equity commitment, ownership share, return objectives and investment horizon. These criteria make early conversations more productive and help distinguish a promising opportunity from a distraction.</p>
<h2 id="what-is-being-acquired">Establish what is being acquired</h2>
<p>Identify the proposed transaction perimeter: shares in a project company, an interest in a portfolio, or a development platform. Ask who owns the relevant interests, who is authorised to discuss a sale, and which obligations would remain with the buyer.</p>
<ul>
<li>What percentage is available, and what governance rights accompany it?</li>
<li>Which assets, contracts, debt and liabilities sit within the perimeter?</li>
<li>Are there partner consents, lender approvals or other transfer conditions to investigate?</li>
</ul>
<p>Ownership and transfer questions should be reviewed by qualified legal advisers before conclusions are drawn.</p>
<h2 id="stage-and-evidence">Understand the stage and evidence</h2>
<p>A development-stage opportunity should be assessed differently from an operating wind farm. For development assets, focus on the evidence behind site access, planning status, permits, grid arrangements and the route to construction. For operating assets, request historical generation, availability, maintenance and financial records.</p>
<p>Separate confirmed documents from management expectations. A useful screening summary marks each material assumption as verified, pending verification or unavailable.</p>
<h2 id="commercial-fundamentals">Test the commercial fundamentals</h2>
<p>Review the revenue arrangements and the assumptions connecting generation to cash flow. Questions may include the applicable offtake terms, payment history, curtailment, operating costs, financing obligations and remaining asset life.</p>
<p>A valuation should be supported by a financial model and scenarios, rather than a single price-per-megawatt comparison. Downside cases can help identify which assumptions require deeper work.</p>
<h2 id="next-decision">Set a clear next decision</h2>
<p>The outcome of screening is a decision about whether to investigate further. Agree the missing information, the specialist advisers needed, confidentiality arrangements and the next decision milestone before allocating significant resources.</p>
<p>A concise investment screening memo can capture the opportunity, investment fit, unresolved issues and recommended next steps.</p>
<div class="article-note">This introductory guide provides general information. It is not legal, tax, technical or investment advice for a specific project. Transaction requirements should be assessed with appropriately qualified advisers.</div>`,
    category: "Góc nhìn Đầu tư",
    author: "LÉARGAS Editorial",
    readingTimeMinutes: 5,
    coverImageUrl: "/images/wind.jpg",
    status: "PUBLISHED",
    publishedAt: "2026-11-13",
  },
  {
    id: 2,
    slug: "selling-a-wind-project-market-preparation",
    title: "Preparing a wind project for a credible sale process",
    excerpt:
      "How project owners can organise information, define the sale perimeter and prepare for investor engagement.",
    content: `<h2 id="seller-objectives">Define the seller’s objectives</h2>
<p>A structured sale starts with an explicit objective. Is the owner seeking a complete exit, a partial divestment or a partner to finance the next development phase? These choices affect the investor universe, information requirements and transaction structure.</p>
<p>Align shareholders on the desired outcome, timing, acceptable retained exposure and decision-making authority before approaching investors.</p>
<h2 id="project-story">Organise the project story</h2>
<p>Prepare a consistent account of the project’s location, technology, capacity, stage, ownership and commercial arrangements. Distinguish completed milestones from planned activities and clearly explain the evidence available for each.</p>
<p>The strongest presentation is one that investors can verify. Avoid unsupported claims about approvals, returns or guaranteed completion dates.</p>
<h2 id="data-room">Build an orderly data room</h2>
<p>Collect and index the documents that support investor review. Depending on the project stage, these may include:</p>
<ul>
<li>Corporate structure, shareholding records and shareholder agreements.</li>
<li>Land or site-access documents, planning records and permits.</li>
<li>Grid connection and revenue or offtake arrangements.</li>
<li>Resource assessments, technical reports and key construction or service contracts.</li>
<li>Financial statements, financing documents and the project financial model.</li>
</ul>
<p>Use controlled access and a clear document version history. Counsel should help determine what can be shared, when and with whom.</p>
<h2 id="difficult-questions">Prepare for difficult questions</h2>
<p>Investors will seek to understand unresolved matters as well as strengths. Identify missing documentation, contractual constraints, technical issues and disagreements between the financial model and historical performance.</p>
<p>Where possible, develop an action plan and assign responsibility for each issue. Transparent, consistent responses can reduce avoidable disruption during diligence.</p>
<h2 id="engagement">Manage engagement with discipline</h2>
<p>A non-confidential teaser can introduce an opportunity without exposing sensitive project details. Further information should be shared through an agreed process with suitable confidentiality protections.</p>
<p>Maintain an investor log, a central questions-and-answers register and consistent milestones. Compare offers on structure, conditions and execution requirements as well as headline price.</p>
<div class="article-note">This introductory guide provides general information. It is not legal, tax, technical or investment advice for a specific project. Transaction requirements should be assessed with appropriately qualified advisers.</div>`,
    category: "M&A & Hợp tác Chiến lược",
    author: "LÉARGAS Editorial",
    readingTimeMinutes: 4,
    coverImageUrl: "/images/coastline.jpg",
    status: "PUBLISHED",
    publishedAt: "2026-11-15",
  },
  {
    id: 3,
    slug: "navigating-pdp8-investor-priorities",
    title: "Navigating Power Development Plan 8 (PDP8): priorities for investors",
    excerpt:
      "Understanding regulatory timelines, grid connection approvals, and the transition path to competitive auction frameworks.",
    content: `<h2 id="pdp8-context">The PDP8 Regulatory Landscape</h2>
<p>Vietnam’s National Power Development Plan for the 2021–2030 period with a vision to 2050 (PDP8) represents a pivotal shift toward decarbonisation and energy security. For international energy sponsors and institutional lenders, navigating this framework requires understanding how project pipelines transition from master-plan endorsement into bankable execution.</p>
<p>The implementation plan prioritises onshore, nearshore, and offshore wind capacity, while introducing rigorous timelines to retire non-performing licences and reallocate grid capacity to shovel-ready developments.</p>
<h2 id="grid-connectivity">Grid connection approvals and curtailment risks</h2>
<p>Grid integration remains the single most critical gating item for project feasibility in renewable-dense provinces such as Ninh Thuan, Binh Thuan, and Tra Vinh. Investors must conduct forensic grid capacity assessments:</p>
<ul>
<li>Reviewing the 500kV and 220kV transmission line commissioning timelines under the National Power Transmission Corporation (EVNNPT).</li>
<li>Assessing dynamic curtailment risks and potential impact on Levelised Cost of Energy (LCOE).</li>
<li>Evaluating co-located battery energy storage systems (BESS) as a grid stabiliser and curtailment mitigation strategy.</li>
</ul>
<h2 id="dppa-mechanisms">Direct Power Purchase Agreement (DPPA) mechanism</h2>
<p>The landmark Decree No. 80/2024/ND-CP establishing the Direct Power Purchase Agreement (DPPA) mechanism creates a direct bilateral procurement avenue between renewable energy developers and large power consumers. This allows creditworthy corporate off-takers (such as multinational tech, semiconductor, and manufacturing hubs) to contract clean energy via both physical dedicated lines and virtual contracts-for-difference (CfD) through the national grid.</p>
<p>Projects structured under DPPA benefit from diversified offtake counterparty risk and currency indexing options that enhance international project finance viability.</p>
<h2 id="auction-transition">Transition to competitive bidding and FIT sunset</h2>
<p>With the sunset of historical Feed-in Tariff (FIT) regimes, transitional projects and new wind pipelines must benchmark pricing against the Ministry of Industry and Trade (MOIT) ceiling tariff frameworks. Investors must align financial modelling with tariff negotiation dynamics, commercial operation date (COD) commitments, and EVN power purchase agreement (PPA) standard conditions.</p>
<h2 id="strategic-checklist">Key priorities for institutional investors</h2>
<p>Before committing development or acquisition capital, sponsors should execute a four-point verification:</p>
<ul>
<li>Verify project inclusion in provincial PDP8 implementation quotas and provincial land-use master plans.</li>
<li>Confirm environmental impact assessment (EIA) validity and maritime area allocation for offshore wind plots.</li>
<li>Model downside sensitivity for curtailment, dispatch scheduling, and transmission reinforcement milestones.</li>
<li>Retain experienced local legal and technical transaction counsel early in the screening phase.</li>
</ul>
<div class="article-note">This analysis is provided for general strategic information and does not constitute formal legal, regulatory or financial opinion. Project developers and investors should seek bespoke advisory tailored to their specific asset perimeter.</div>`,
    category: "Pháp lý & Quy hoạch PDP8",
    author: "LÉARGAS Research",
    readingTimeMinutes: 6,
    coverImageUrl: "/images/wind.jpg",
    status: "PUBLISHED",
    publishedAt: "2026-11-17",
  },
]

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = React.useState<PostItem[]>(DEFAULT_POSTS)
  const [categories, setCategories] = React.useState<CategoryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")

  // Modal Xem trước bài viết
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false)
  const [previewPost, setPreviewPost] = React.useState<PostItem | null>(null)
  const [previewLoading, setPreviewLoading] = React.useState(false)

  const previewContent = previewPost?.content
  const articleHeadings = React.useMemo(() => {
    if (!previewContent) return []
    const matches = [...previewContent.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)]
    return matches.map(([, id, title]) => ({
      id: id || "",
      title: (title || "").replace(/<[^>]+>/g, ""),
    }))
  }, [previewContent])

  const fetchPosts = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch<{ content: PostItem[] }>("/api/admin/posts")
      if (res.content && res.content.length > 0) {
        setPosts(res.content)
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let ignore = false
    adminFetch<{ content: PostItem[] }>("/api/admin/posts")
      .then((res) => {
        if (!ignore && res.content && res.content.length > 0) {
          setPosts(res.content)
        }
      })
      .catch(() => {
        // Keep defaults
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    adminFetch<CategoryItem[]>("/api/admin/categories")
      .then((cats) => {
        if (!ignore && cats) setCategories(cats)
      })
      .catch(() => {
        // ignore
      })

    return () => {
      ignore = true
    }
  }, [])

  const handleDelete = async (id: number, title: string) => {
    try {
      await adminFetch(`/api/admin/posts/${id}`, { method: "DELETE" })
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success("Đã xóa bài viết thành công!", {
        description: `Bài viết "${title}" đã được xóa khỏi hệ thống.`,
      })
    } catch {
      toast.error("Không thể xóa bài viết", {
        description: "Vui lòng kiểm tra lại dịch vụ Backend.",
      })
    }
  }

  const handleOpenPreview = async (record: PostItem) => {
    setPreviewPost(record)
    setPreviewModalOpen(true)
    setPreviewLoading(true)

    try {
      const fullDetail = await adminFetch<PostItem>(`/api/admin/posts/${record.id}`)
      if (fullDetail) {
        setPreviewPost(fullDetail)
      }
    } catch {
      // Use existing record
    } finally {
      setPreviewLoading(false)
    }
  }

  const getCategoryColor = (catName: string) => {
    const found = categories.find((c) => c.name === catName)
    if (found?.color) return found.color
    if (catName.includes("Đầu tư")) return "#1677ff"
    if (catName.includes("M&A")) return "#52c41a"
    if (catName.includes("Pháp lý")) return "#722ed1"
    if (catName.includes("Thi công")) return "#fa8c16"
    return "#13c2c2"
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      post.author?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter
    const matchesCat = categoryFilter === "ALL" || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCat
  })

  const columns = [
    {
      title: "Bài viết",
      key: "postInfo",
      render: (_: unknown, record: PostItem) => {
        const cover = record.coverImageUrl?.startsWith("http")
          ? record.coverImageUrl
          : record.coverImageUrl?.startsWith("/uploads")
            ? `http://localhost:8080${record.coverImageUrl}`
            : record.coverImageUrl || "/images/wind.jpg"

        return (
          <div className="flex items-start gap-3">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-[#e8e8e8] bg-[#f5f5f5]">
              <Image
                src={cover}
                alt={record.title}
                className="h-full w-full object-cover"
                fallback="/images/wind.jpg"
                preview={false}
              />
            </div>

            <div className="min-w-0 flex-1">
              <a
                onClick={() => handleOpenPreview(record)}
                className="cursor-pointer font-sans text-sm font-semibold text-[#1f1f1f] transition-colors hover:text-[#1677ff]"
              >
                {record.title}
              </a>
              {record.excerpt && (
                <p className="mt-0.5 line-clamp-1 text-xs text-[#8c8c8c]">{record.excerpt}</p>
              )}
              <span className="mt-1 inline-block font-mono text-[11px] text-[#bfbfbf]">
                /blog/{record.slug}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: "Chuyên mục",
      dataIndex: "category",
      key: "category",
      width: 170,
      render: (cat: string) => (
        <Tag color={getCategoryColor(cat)} className="rounded-full px-2.5 py-0.5 font-medium">
          {cat}
        </Tag>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: 150,
      render: (author: string, record: PostItem) => (
        <div className="text-xs">
          <div className="font-medium text-[#262626]">{author}</div>
          <div className="text-[11px] text-[#8c8c8c]">
            {record.readingTimeMinutes || 5} phút đọc
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center" as const,
      render: (status: string) => {
        if (status === "PUBLISHED") {
          return (
            <Tag color="success" className="rounded-md font-medium">
              Đã xuất bản
            </Tag>
          )
        }
        if (status === "DRAFT") {
          return (
            <Tag color="warning" className="rounded-md font-medium">
              Bản nháp
            </Tag>
          )
        }
        return (
          <Tag color="default" className="rounded-md font-medium">
            Lưu trữ
          </Tag>
        )
      },
    },
    {
      title: "Ngày đăng",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 120,
      align: "center" as const,
      render: (val: string, record: PostItem) => (
        <span className="text-xs text-[#8c8c8c]">
          {val || record.createdAt?.split("T")[0] || "18/11/2026"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 190,
      align: "right" as const,
      render: (_: unknown, record: PostItem) => (
        <Space size="small">
          {/* Nút Xem trước / Xem chi tiết */}
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleOpenPreview(record)}
            className="text-[#1677ff] hover:bg-[#e6f4ff]"
            title="Xem chi tiết & Xem trước bài viết"
          >
            Xem
          </Button>

          {/* Nút Chỉnh sửa */}
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/posts/${record.id}/edit`)}
            className="text-[#52c41a] hover:bg-[#f6ffed]"
            title="Chỉnh sửa bài viết"
          >
            Sửa
          </Button>

          {/* Nút Xóa có Popconfirm */}
          <Popconfirm
            title="Xác nhận xóa bài viết?"
            description={`Bạn có chắc muốn xóa bài "${record.title}"?`}
            onConfirm={() => handleDelete(record.id, record.title)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover:bg-[#fff2f0]"
              title="Xóa bài viết"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-sans">
      {/* Tiêu đề & Nút Thao tác trên cùng */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title level={4} className="!mb-1 !font-sans !font-bold !text-[#1f1f1f]">
            Quản lý Bài viết (Blog & Insights)
          </Title>
          <Text className="text-xs text-[#8c8c8c]">
            Quản trị các bài phân tích chuyên sâu, thương vụ M&A và quy hoạch năng lượng LÉARGAS
          </Text>
        </div>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPosts}
            loading={loading}
            className="!rounded-lg text-xs"
          >
            Làm mới
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/admin/posts/new")}
            className="!rounded-lg !bg-[#1677ff] text-xs font-semibold shadow-sm hover:!bg-[#4096ff]"
          >
            Thêm bài viết mới
          </Button>
        </Space>
      </div>

      {/* Thanh bộ lọc & Tìm kiếm Ant Design */}
      <Card className="rounded-xl border border-[#f0f0f0] p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
          <div className="sm:col-span-6">
            <Input
              prefix={<SearchOutlined className="text-[#8c8c8c]" />}
              placeholder="Tìm kiếm theo tiêu đề bài viết, tóm tắt hoặc tác giả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              className="rounded-lg font-sans text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-full text-xs"
              options={[
                { value: "ALL", label: "Tất cả chuyên mục" },
                ...categories.map((c) => ({ value: c.name, label: c.name })),
              ]}
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full text-xs"
              options={[
                { value: "ALL", label: "Tất cả trạng thái" },
                { value: "PUBLISHED", label: "Đã xuất bản" },
                { value: "DRAFT", label: "Bản nháp" },
                { value: "ARCHIVED", label: "Lưu trữ" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Bảng dữ liệu bài viết Ant Design */}
      <Card className="overflow-hidden rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} bài viết` }}
          className="font-sans"
        />
      </Card>

      {/* Modal Xem trước / Xem chi tiết Bài viết chuẩn Ant Design */}
      <Modal
        title={
          <div className="flex items-center justify-between pr-6 font-sans">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e6f4ff] text-[#1677ff]">
                <EyeOutlined className="text-sm" />
              </span>
              <div>
                <div className="text-sm font-semibold text-[#1f1f1f] md:text-base">
                  Bản xem trước Bài viết đầy đủ (Full Article Preview)
                </div>
                <div className="text-[11px] font-normal text-[#8c8c8c]">
                  Chuẩn hóa theo định dạng ấn phẩm cao cấp của LÉARGAS Energy Partners
                </div>
              </div>
            </div>
            {previewPost && (
              <Tag
                color={previewPost.status === "PUBLISHED" ? "success" : "warning"}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {previewPost.status === "PUBLISHED" ? "● ĐÃ XUẤT BẢN" : "● BẢN NHÁP"}
              </Tag>
            )}
          </div>
        }
        open={previewModalOpen}
        onCancel={() => setPreviewModalOpen(false)}
        width={960}
        centered
        styles={{
          body: {
            maxHeight: "calc(82vh - 110px)",
            overflowY: "auto",
            paddingRight: "12px",
          },
        }}
        footer={[
          <Button key="close" onClick={() => setPreviewModalOpen(false)} className="rounded-lg">
            Đóng
          </Button>,
          previewPost && (
            <Link
              key="viewPublic"
              href={`/blog/${previewPost.slug}`}
              target="_blank"
              className="inline-block"
            >
              <Button
                icon={<GlobalOutlined />}
                className="rounded-lg hover:!border-[#1677ff] hover:!text-[#1677ff]"
              >
                Xem trên Website khách ↗
              </Button>
            </Link>
          ),
          previewPost && (
            <Button
              key="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setPreviewModalOpen(false)
                router.push(`/admin/posts/${previewPost.id}/edit`)
              }}
              className="rounded-lg !bg-[#1677ff] font-medium hover:!bg-[#4096ff]"
            >
              Chỉnh sửa bài viết này
            </Button>
          ),
        ]}
        destroyOnClose
      >
        {previewPost && (
          <div className="space-y-6 py-2 font-sans">
            {/* Ảnh bìa bài viết với badge chuyên mục & tỉ lệ điện ảnh */}
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-[#eaedf0] bg-[#001c14] shadow-sm">
              <Image
                src={
                  previewPost.coverImageUrl?.startsWith("http")
                    ? previewPost.coverImageUrl
                    : previewPost.coverImageUrl?.startsWith("/uploads")
                      ? `http://localhost:8080${previewPost.coverImageUrl}`
                      : previewPost.coverImageUrl || "/images/wind.jpg"
                }
                alt={previewPost.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                fallback="/images/wind.jpg"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="pointer-events-none absolute right-4 bottom-3 left-4 flex items-center justify-between text-white">
                <Tag
                  color={getCategoryColor(previewPost.category)}
                  className="rounded-full border-0 px-3 py-1 text-xs font-semibold shadow-sm"
                >
                  {previewPost.category}
                </Tag>
                <span className="rounded-full bg-black/40 px-2.5 py-0.5 font-mono text-xs text-white/80 backdrop-blur-xs">
                  /blog/{previewPost.slug}
                </span>
              </div>
            </div>

            {/* Header thông tin biên tập & Metadata */}
            <div className="border-b border-[#f0f0f0] pb-4">
              <h1 className="mb-3 font-heading text-2xl leading-tight font-semibold tracking-[-0.02em] text-[#00281c] md:text-3xl">
                {previewPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#8c8c8c]">
                <div className="flex items-center gap-1.5 font-medium text-[#262626]">
                  <UserOutlined className="text-[#1677ff]" />
                  <span>{previewPost.author}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <ClockCircleOutlined className="text-[#fa8c16]" />
                  <span>{previewPost.readingTimeMinutes || 5} phút đọc</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <CalendarOutlined className="text-[#52c41a]" />
                  <span>{previewPost.publishedAt || "18/11/2026"}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <LinkOutlined className="text-[#722ed1]" />
                  <span className="font-mono text-[11px] text-[#595959]">ID #{previewPost.id}</span>
                </div>
              </div>
            </div>

            {/* Khung Tóm tắt điều hành (Executive Summary Box) */}
            {previewPost.excerpt && (
              <div className="rounded-xl border-l-4 border-[#00281c] bg-[#f7f9f7] p-4 text-sm text-[#2d3748] shadow-xs">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#00281c] uppercase">
                  <FileTextOutlined />
                  <span>Tóm tắt định hướng thương vụ</span>
                </div>
                <p className="leading-relaxed font-medium text-[#2d3748] italic">
                  {previewPost.excerpt}
                </p>
              </div>
            )}

            {/* Thanh điều hướng Mục lục các phần (Section Pills) */}
            {articleHeadings.length > 0 && (
              <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
                <div className="mb-2 text-[11px] font-semibold tracking-wider text-[#8c8c8c] uppercase">
                  Mục lục các phần chính ({articleHeadings.length} đề mục):
                </div>
                <div className="flex flex-wrap gap-2">
                  {articleHeadings.map((h, idx) => (
                    <span
                      key={h.id || idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8e8e8] bg-white px-2.5 py-1 text-xs text-[#595959] shadow-2xs"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f0f0f0] text-[10px] font-bold text-[#8c8c8c]">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-[#262626]">{h.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Toàn bộ nội dung bài viết theo chuẩn tạp chí tài chính cao cấp */}
            <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-xs md:p-8">
              {previewLoading ? (
                <div className="py-12 text-center text-xs text-[#8c8c8c]">
                  <ReloadOutlined spin className="mx-auto mb-2 block text-lg text-[#1677ff]" />
                  Đang tải toàn bộ nội dung bài viết từ hệ thống...
                </div>
              ) : (
                <div
                  className="article-body prose prose-slate max-w-none text-[15px] leading-[1.8] text-[#2d3748]"
                  dangerouslySetInnerHTML={{
                    __html: previewPost.content || "<p>Bài viết chưa có nội dung chi tiết.</p>",
                  }}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

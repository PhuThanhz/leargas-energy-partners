"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Upload,
  Typography,
  Space,
  Radio,
  Image,
} from "antd"
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  PictureOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import { toast } from "sonner"
import { adminFetch, getStoredAuth } from "@/lib/api/admin-client"

const { Text } = Typography
const { TextArea } = Input

interface CategoryItem {
  id: number
  name: string
  slug: string
  color: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [category, setCategory] = React.useState("Góc nhìn Đầu tư")
  const [categories, setCategories] = React.useState<CategoryItem[]>([])
  const [author, setAuthor] = React.useState("Ban Biên tập LÉARGAS")
  const [coverImageUrl, setCoverImageUrl] = React.useState("/images/wind.jpg")
  const [excerpt, setExcerpt] = React.useState("")
  const [content, setContent] = React.useState(
    `<h2 id="tong-quan">Tổng quan</h2>\n<p>Nhập nội dung phân tích thể chế, thị trường và định hướng đầu tư tại đây...</p>`
  )
  const [status, setStatus] = React.useState("PUBLISHED")
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit")
  const [loading, setLoading] = React.useState(false)

  // Modal tạo nhanh chuyên mục
  const [categoryModalVisible, setCategoryModalVisible] = React.useState(false)
  const [categorySubmitting, setCategorySubmitting] = React.useState(false)
  const [categoryForm] = Form.useForm()

  // Load danh sách chuyên mục thật từ backend
  const fetchCategories = React.useCallback(async () => {
    try {
      const data = await adminFetch<CategoryItem[]>("/api/admin/categories")
      setCategories(data)
    } catch {
      // Fallback
    }
  }, [])

  React.useEffect(() => {
    let ignore = false
    adminFetch<CategoryItem[]>("/api/admin/categories")
      .then((data) => {
        if (!ignore) {
          setCategories(data)
          if (data && data.length > 0 && data[0]?.name && !category) {
            setCategory(data[0].name)
          }
        }
      })
      .catch(() => {
        if (!ignore) {
          setCategories([
            { id: 1, name: "Góc nhìn Đầu tư", slug: "investment-insights", color: "#1677ff" },
            {
              id: 2,
              name: "M&A & Hợp tác Chiến lược",
              slug: "ma-strategic-partnership",
              color: "#52c41a",
            },
            { id: 3, name: "Pháp lý & Quy hoạch PDP8", slug: "legal-pdp8", color: "#722ed1" },
            {
              id: 4,
              name: "Thi công & Triển khai",
              slug: "construction-delivery",
              color: "#fa8c16",
            },
            { id: 5, name: "Tài chính Xanh & ESG", slug: "green-finance-esg", color: "#13c2c2" },
          ])
        }
      })
    return () => {
      ignore = true
    }
  }, [category])

  const autoSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(val))
    }
  }

  // Chèn thẻ định dạng vào nội dung
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("post-content-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    const replacement = `${prefix}${selected || "Nội dung"}${suffix}`

    const newContent = content.substring(0, start) + replacement + content.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 7)
      )
    }, 10)
  }

  // Upload ảnh trực tiếp
  const auth = getStoredAuth()
  const coverUploadProps: UploadProps = {
    name: "file",
    action: "http://localhost:8080/api/admin/media/upload",
    headers: {
      Authorization: auth.token ? `Bearer ${auth.token}` : "",
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === "done") {
        const url = info.file.response?.url || `/uploads/${info.file.name}`
        const displayUrl = url.startsWith("http") ? url : `http://localhost:8080${url}`
        setCoverImageUrl(displayUrl)
        toast.success("Tải lên ảnh bìa thành công!")
      } else if (info.file.status === "error") {
        toast.error("Không thể tải lên ảnh bìa", {
          description: "Vui lòng kiểm tra lại dịch vụ Backend cổng 8080.",
        })
      }
    },
  }

  // Upload ảnh chèn vào bài viết
  const inlineUploadProps: UploadProps = {
    name: "file",
    action: "http://localhost:8080/api/admin/media/upload",
    headers: {
      Authorization: auth.token ? `Bearer ${auth.token}` : "",
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === "done") {
        const url = info.file.response?.url || `/uploads/${info.file.name}`
        const displayUrl = url.startsWith("http") ? url : `http://localhost:8080${url}`
        const imgTag = `\n<figure class="my-6">\n  <img src="${displayUrl}" alt="${info.file.name}" class="w-full rounded-xl shadow-md" />\n  <figcaption class="mt-2 text-center text-xs text-gray-500">${info.file.name}</figcaption>\n</figure>\n`
        setContent((prev) => prev + imgTag)
        toast.success("Đã tải ảnh lên và chèn vào bài viết!")
      } else if (info.file.status === "error") {
        toast.error("Không thể tải ảnh chèn vào bài viết")
      }
    },
  }

  // Tạo chuyên mục nhanh
  const handleQuickCreateCategory = async () => {
    try {
      const values = await categoryForm.validateFields()
      setCategorySubmitting(true)
      const res = await adminFetch<CategoryItem>("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(values),
      })
      toast.success(`Đã tạo chuyên mục: "${values.name}"`)
      await fetchCategories()
      setCategory(res.name)
      setCategoryModalVisible(false)
      categoryForm.resetFields()
    } catch {
      toast.error("Không thể tạo chuyên mục mới")
    } finally {
      setCategorySubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết!")
      return
    }
    if (!slug.trim()) {
      toast.error("Vui lòng nhập đường dẫn tĩnh (slug)!")
      return
    }

    setLoading(true)
    try {
      await adminFetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          category,
          author,
          coverImageUrl,
          excerpt,
          content,
          status,
        }),
      })
      toast.success("Tạo bài viết mới thành công!", {
        description: `Bài viết "${title}" đã được lưu vào hệ thống.`,
      })
      router.push("/admin/posts")
    } catch {
      toast.error("Không thể lưu bài viết", {
        description: "Vui lòng kiểm tra lại kết nối Spring Boot.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Thanh tác vụ trên cùng */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#f0f0f0] bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center">
        <Link
          href="/admin/posts"
          className="flex items-center gap-2 text-xs font-medium text-[#595959] transition-colors hover:text-[#1677ff]"
        >
          <ArrowLeftOutlined />
          Quay lại danh sách bài viết
        </Link>

        <div className="flex items-center gap-3">
          <Radio.Group
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="middle"
          >
            <Radio.Button value="edit">
              <Space orientation="horizontal">
                <EditOutlined />
                <span>Soạn thảo</span>
              </Space>
            </Radio.Button>
            <Radio.Button value="preview">
              <Space orientation="horizontal">
                <EyeOutlined />
                <span>Xem trước</span>
              </Space>
            </Radio.Button>
          </Radio.Group>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
            className="!rounded-lg !bg-[#1677ff] font-medium shadow-sm hover:!bg-[#4096ff]"
          >
            Lưu bài viết
          </Button>
        </div>
      </div>

      {/* Bố cục 2 cột bài bản: Cột Trái 8 phần (Nội dung) + Cột Phải 4 phần (Thuộc tính & Upload) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Cột Trái: Trình soạn thảo & Nội dung bài viết */}
        <div className="space-y-6 lg:col-span-8">
          <Card className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <div className="space-y-5">
              {/* Tiêu đề bài viết */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">
                  Tiêu đề bài viết <span className="text-[#ff4d4f]">*</span>
                </label>
                <Input
                  size="large"
                  placeholder="VD: Định hướng Quy hoạch điện 8 (PDP8) cho các nhà đầu tư quốc tế..."
                  value={title}
                  onChange={handleTitleChange}
                  className="rounded-lg font-sans font-medium text-[#1f1f1f]"
                />
              </div>

              {/* Slug URL */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">
                  Đường dẫn tĩnh (Slug URL) <span className="text-[#ff4d4f]">*</span>
                </label>
                <Input
                  addonBefore="https://leargasenergy.com/blog/"
                  placeholder="dinh-huong-pdp8-cho-nha-dau-tu"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="rounded-lg font-mono text-xs text-[#595959]"
                />
              </div>

              {/* Tóm tắt nội dung */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">
                  Tóm tắt ngắn (Excerpt / Mô tả hiển thị ngoài danh sách & Google)
                </label>
                <TextArea
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn 1-2 câu về nội dung cốt lõi của bài phân tích..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="rounded-lg text-xs"
                />
              </div>

              {/* Trình soạn thảo Nội dung hoặc Xem trước Live Preview */}
              <div>
                <div className="orientation mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#262626]">
                    Nội dung chi tiết (HTML / Markdown) <span className="text-[#ff4d4f]">*</span>
                  </label>

                  {/* Thanh công cụ định dạng chuyên nghiệp */}
                  {activeTab === "edit" && (
                    <div className="flex flex-wrap items-center gap-1 rounded-md border border-[#e8e8e8] bg-[#fafafa] p-1 text-xs">
                      <Button
                        type="text"
                        size="small"
                        onClick={() => insertFormatting("<h2>", "</h2>")}
                        className="px-2 font-bold"
                        title="Tiêu đề H2"
                      >
                        H2
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        onClick={() => insertFormatting("<h3>", "</h3>")}
                        className="px-2 font-bold"
                        title="Tiêu đề H3"
                      >
                        H3
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        icon={<BoldOutlined />}
                        onClick={() => insertFormatting("<strong>", "</strong>")}
                        title="In đậm"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<ItalicOutlined />}
                        onClick={() => insertFormatting("<em>", "</em>")}
                        title="In nghiêng"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={() => insertFormatting('<a href="https://...">', "</a>")}
                        title="Chèn liên kết"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<UnorderedListOutlined />}
                        onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")}
                        title="Danh sách"
                      />

                      <div className="mx-1 h-3.5 w-px bg-[#d9d9d9]" />

                      {/* Nút Upload và Chèn ảnh trực tiếp vào nội dung */}
                      <Upload {...inlineUploadProps}>
                        <Button
                          type="text"
                          size="small"
                          icon={<PictureOutlined className="text-[#1677ff]" />}
                          className="text-[#1677ff]"
                          title="Tải ảnh lên và chèn vào bài viết"
                        >
                          Chèn ảnh
                        </Button>
                      </Upload>
                    </div>
                  )}
                </div>

                {activeTab === "edit" ? (
                  <TextArea
                    id="post-content-textarea"
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="font-mono text-xs leading-relaxed"
                  />
                ) : (
                  <div className="min-h-[360px] rounded-lg border border-[#e8e8e8] bg-[#fbfdfb] p-6">
                    <div
                      className="prose prose-emerald max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Cột Phải: Xuất bản, Khai báo Chuyên mục & Upload Ảnh bìa */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card Xuất bản */}
          <Card
            title={<span className="text-xs font-bold text-[#1f1f1f]">Trạng thái & Xuất bản</span>}
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-[#595959]">Trạng thái bài viết</label>
                <Select
                  value={status}
                  onChange={setStatus}
                  className="w-full"
                  options={[
                    { value: "PUBLISHED", label: "Đã xuất bản (Công khai)" },
                    { value: "DRAFT", label: "Bản nháp (Chưa công khai)" },
                    { value: "ARCHIVED", label: "Lưu trữ (Ẩn)" },
                  ]}
                />
              </div>

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={loading}
                className="!h-9 !w-full !rounded-lg !bg-[#1677ff] text-xs font-semibold shadow-sm hover:!bg-[#4096ff]"
              >
                {status === "PUBLISHED" ? "Xuất bản bài viết ngay" : "Lưu bản nháp"}
              </Button>
            </div>
          </Card>

          {/* Card Khai báo Chuyên mục */}
          <Card
            title={
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1f1f1f]">Chuyên mục bài viết</span>
                <Button
                  type="link"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    categoryForm.resetFields()
                    setCategoryModalVisible(true)
                  }}
                  className="p-0 text-xs text-[#1677ff]"
                >
                  Thêm mới
                </Button>
              </div>
            }
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <div className="space-y-3">
              <label className="block text-xs text-[#595959]">
                Chọn chuyên mục chính cho bài viết:
              </label>
              <Select
                value={category}
                onChange={setCategory}
                className="w-full"
                placeholder="Chọn chuyên mục"
                options={categories.map((c) => ({
                  value: c.name,
                  label: (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: c.color || "#1677ff" }}
                      />
                      <span>{c.name}</span>
                    </div>
                  ),
                }))}
              />

              <div className="mt-2 text-xs text-[#8c8c8c]">
                Chuyên mục giúp phân loại bài viết và hỗ trợ bộ lọc ngoài trang người đọc.
              </div>
            </div>
          </Card>

          {/* Card Upload Ảnh bìa / Thumbnail */}
          <Card
            title={
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1f1f1f]">Ảnh đại diện (Cover Image)</span>
                {coverImageUrl && (
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setCoverImageUrl("")}
                    className="p-0 text-xs"
                  >
                    Xóa ảnh
                  </Button>
                )}
              </div>
            }
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <div className="space-y-3">
              {coverImageUrl ? (
                <div className="overflow-hidden rounded-lg border border-[#e8e8e8] bg-[#fafafa]">
                  <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                    <Image
                      src={coverImageUrl}
                      alt="Ảnh đại diện"
                      className="h-full w-full object-cover"
                      fallback="/images/wind.jpg"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5">
                    <Text className="truncate text-xs text-[#595959]" title={coverImageUrl}>
                      {coverImageUrl}
                    </Text>

                    <Upload {...coverUploadProps}>
                      <Button size="small" icon={<UploadOutlined />} className="text-xs">
                        Đổi ảnh
                      </Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                <Upload.Dragger
                  {...coverUploadProps}
                  className="!border-[#d9d9d9] !bg-[#fafafa] p-4 hover:!border-[#1677ff]"
                >
                  <p className="ant-upload-drag-icon !mb-1">
                    <PictureOutlined className="!text-2xl text-[#1677ff]" />
                  </p>
                  <p className="font-sans text-xs font-semibold text-[#262626]">
                    Tải lên ảnh đại diện bài viết
                  </p>
                  <p className="text-[11px] text-[#8c8c8c]">Kéo thả hoặc nhấp để chọn file ảnh</p>
                </Upload.Dragger>
              )}

              <div>
                <label className="mb-1 block text-xs text-[#8c8c8c]">Hoặc nhập URL ảnh:</label>
                <Input
                  size="small"
                  placeholder="https://... hoặc /images/wind.jpg"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="rounded font-mono text-xs"
                />
              </div>
            </div>
          </Card>

          {/* Card Tác giả & Thông tin phụ */}
          <Card
            title={<span className="text-xs font-bold text-[#1f1f1f]">Thông tin Tác giả</span>}
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-[#595959]">
                  Tác giả / Khối nghiên cứu
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="rounded-md text-xs font-medium"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal tạo nhanh Chuyên mục mới */}
      <Modal
        title="Khai báo Chuyên mục Mới"
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        onOk={handleQuickCreateCategory}
        confirmLoading={categorySubmitting}
        okText="Tạo chuyên mục"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={categoryForm} layout="vertical" className="mt-3">
          <Form.Item
            name="name"
            label="Tên chuyên mục"
            rules={[{ required: true, message: "Vui lòng nhập tên chuyên mục!" }]}
          >
            <Input
              placeholder="VD: Thị trường Điện gió ngoài khơi..."
              onChange={(e) => categoryForm.setFieldsValue({ slug: autoSlug(e.target.value) })}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug URL"
            rules={[{ required: true, message: "Vui lòng nhập slug URL!" }]}
          >
            <Input placeholder="thi-truong-dien-gio" className="font-mono text-xs" />
          </Form.Item>

          <Form.Item name="color" label="Màu sắc nhận diện" initialValue="#1677ff">
            <Select
              options={[
                { value: "#1677ff", label: <Tag color="#1677ff">Xanh lam (#1677ff)</Tag> },
                { value: "#52c41a", label: <Tag color="#52c41a">Xanh lục (#52c41a)</Tag> },
                { value: "#722ed1", label: <Tag color="#722ed1">Tím hoàng gia (#722ed1)</Tag> },
                { value: "#fa8c16", label: <Tag color="#fa8c16">Cam năng lượng (#fa8c16)</Tag> },
                { value: "#13c2c2", label: <Tag color="#13c2c2">Xanh ngọc (#13c2c2)</Tag> },
              ]}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={2} placeholder="Mô tả ngắn về chuyên mục này..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

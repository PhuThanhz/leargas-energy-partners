"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Upload,
  Radio,
  Space,
  Image,
  Tooltip,
  ColorPicker,
} from "antd"
import type { UploadProps } from "antd"
import {
  ArrowLeftOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
  PictureOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import { toast } from "sonner"

import { adminFetch, adminUpload, resolveMediaUrl } from "@/lib/api/admin-client"
import { addHeadingIds, getTableOfContents, slugify } from "@/lib/heading-ids"
import { cn } from "@/lib/utils"
import { ARTICLE_BACKGROUNDS, DEFAULT_ARTICLE_BG, isTooDarkForText } from "@/lib/article-colors"
import { refreshBlogSafely } from "@/app/(admin)/admin/posts/refresh-blog"
import { MediaPicker } from "@/components/admin/media-picker"
import { RichArticleEditor } from "@/components/admin/rich-article-editor"
import { ArticleView } from "@/components/blog/article-view"

const { TextArea } = Input

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export interface PostDetail {
  id: number
  title: string
  slug: string
  category: string
  author: string
  coverImageUrl: string
  /** #rrggbb, or "" for the site default. */
  backgroundColor: string
  excerpt: string
  content: string
  status: PostStatus
  publishedAt?: string | null
}

export type PostPayload = Omit<PostDetail, "id" | "publishedAt">

interface CategoryItem {
  id: number
  name: string
  slug: string
  color: string
}

interface PostEditorFormProps {
  /** Existing post when editing; omitted when creating. */
  initial?: PostDetail
  /** Persist the post and return what the server saved. */
  onSave: (payload: PostPayload) => Promise<PostDetail>
}

const DEFAULT_AUTHOR = "Ban Biên tập LÉARGAS"
const DEFAULT_COVER = "/images/wind.jpg"
const STARTER_CONTENT = `<h2>Tổng quan</h2><p></p>`
const MAX_UPLOAD_MB = 10

function readingMinutes(html: string) {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(iso?: string | null) {
  const date = iso ? new Date(iso) : new Date()
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function PostEditorForm({ initial, onSave }: PostEditorFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initial)

  const initialValues = React.useMemo<PostPayload>(
    () => ({
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      category: initial?.category ?? "",
      author: initial?.author || DEFAULT_AUTHOR,
      coverImageUrl: initial?.coverImageUrl ?? DEFAULT_COVER,
      backgroundColor: initial?.backgroundColor ?? "",
      excerpt: initial?.excerpt ?? "",
      content: initial?.content ?? STARTER_CONTENT,
      status: initial?.status ?? "DRAFT",
    }),
    [initial]
  )

  const [values, setValues] = React.useState<PostPayload>(initialValues)
  // Snapshot used for the "unsaved changes" check; picks up auto-filled defaults.
  const [baseline, setBaseline] = React.useState<PostPayload>(initialValues)
  const [slugTouched, setSlugTouched] = React.useState(isEdit)
  const [categories, setCategories] = React.useState<CategoryItem[]>([])
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit")
  const [saving, setSaving] = React.useState<PostStatus | null>(null)
  const [uploadingCover, setUploadingCover] = React.useState(false)
  const [pickerOpen, setPickerOpen] = React.useState(false)

  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false)
  const [categorySubmitting, setCategorySubmitting] = React.useState(false)
  const [categoryForm] = Form.useForm()
  const [modal, modalContextHolder] = Modal.useModal()

  const set = <K extends keyof PostPayload>(key: K, value: PostPayload[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const dirty = React.useMemo(
    () => JSON.stringify(values) !== JSON.stringify(baseline),
    [values, baseline]
  )

  // Warn before closing the tab / reloading with unsaved changes.
  React.useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  const loadCategories = React.useCallback(async () => {
    try {
      const data = await adminFetch<CategoryItem[]>("/api/admin/categories")
      setCategories(data)
      return data
    } catch {
      return []
    }
  }, [])

  React.useEffect(() => {
    let ignore = false
    adminFetch<CategoryItem[]>("/api/admin/categories")
      .then((data) => {
        if (ignore) return
        setCategories(data)
        // New posts default to the first category.
        const first = data[0]?.name
        if (first) {
          setValues((prev) => (prev.category ? prev : { ...prev, category: first }))
          setBaseline((prev) => (prev.category ? prev : { ...prev, category: first }))
        }
      })
      .catch(() => {
        if (!ignore) toast.error("Không tải được danh sách chuyên mục")
      })
    return () => {
      ignore = true
    }
  }, [])

  const handleTitleChange = (title: string) => {
    setValues((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }))
  }

  const coverUploadProps: UploadProps = {
    accept: "image/*",
    showUploadList: false,
    disabled: uploadingCover,
    beforeUpload(file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Chỉ chấp nhận file ảnh")
        return Upload.LIST_IGNORE
      }
      if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        toast.error(`Ảnh vượt quá ${MAX_UPLOAD_MB}MB`)
        return Upload.LIST_IGNORE
      }
      return true
    },
    async customRequest({ file, onSuccess, onError }) {
      setUploadingCover(true)
      try {
        const url = await adminUpload(file as File)
        set("coverImageUrl", url)
        onSuccess?.({ url })
        toast.success("Đã tải lên ảnh bìa")
      } catch (error) {
        onError?.(error as Error)
        toast.error("Không thể tải lên ảnh bìa")
      } finally {
        setUploadingCover(false)
      }
    },
  }

  const handleQuickCreateCategory = async () => {
    try {
      const formValues = await categoryForm.validateFields()
      setCategorySubmitting(true)
      const created = await adminFetch<CategoryItem>("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(formValues),
      })
      await loadCategories()
      set("category", created.name)
      setCategoryModalOpen(false)
      categoryForm.resetFields()
      toast.success(`Đã tạo chuyên mục "${created.name}"`)
    } catch (error) {
      if (error instanceof Error) toast.error("Không thể tạo chuyên mục mới")
    } finally {
      setCategorySubmitting(false)
    }
  }

  const handleSave = async (status: PostStatus) => {
    const title = values.title.trim()
    const slug = slugify(values.slug || title)
    const plainContent = values.content.replace(/<[^>]+>/g, "").trim()

    if (!title) return toast.error("Vui lòng nhập tiêu đề bài viết")
    if (!slug) return toast.error("Vui lòng nhập đường dẫn (slug)")
    if (!plainContent) return toast.error("Nội dung bài viết đang trống")
    if (!values.category) return toast.error("Vui lòng chọn chuyên mục")

    setSaving(status)
    try {
      const saved = await onSave({
        ...values,
        title,
        slug,
        excerpt: values.excerpt.trim(),
        author: values.author.trim() || DEFAULT_AUTHOR,
        coverImageUrl: values.coverImageUrl.trim(),
        content: addHeadingIds(values.content),
        status,
      })
      // The post is saved at this point; refreshing the public cache must never hang the form.
      const refreshed = await refreshBlogSafely([saved.slug, initial?.slug])

      toast.success(
        status === "PUBLISHED"
          ? isEdit && initial?.status === "PUBLISHED"
            ? "Đã cập nhật bài viết"
            : "Đã xuất bản bài viết"
          : "Đã lưu bản nháp",
        saved.slug !== slug
          ? { description: `Đường dẫn được đổi thành /blog/${saved.slug}` }
          : undefined
      )
      // A pending server action would hold up client navigation, so fall back to a full load.
      if (refreshed) router.push("/admin/posts")
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional hard load, see above
      else window.location.assign("/admin/posts")
    } catch (error) {
      toast.error("Không thể lưu bài viết", {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSaving(null)
    }
  }

  const handleBack = (e: React.MouseEvent) => {
    if (!dirty) return
    e.preventDefault()
    modal.confirm({
      title: "Bỏ các thay đổi chưa lưu?",
      content: "Nội dung bạn vừa soạn sẽ bị mất nếu rời trang.",
      okText: "Rời trang",
      cancelText: "Ở lại",
      okButtonProps: { danger: true },
      onOk: () => router.push("/admin/posts"),
    })
  }

  const wasPublished = initial?.status === "PUBLISHED"
  const coverSrc = resolveMediaUrl(values.coverImageUrl)
  const customBg =
    !!values.backgroundColor && !ARTICLE_BACKGROUNDS.some((c) => c.value === values.backgroundColor)
  const previewHtml = React.useMemo(() => addHeadingIds(values.content), [values.content])
  const categoryOptions = [
    ...categories,
    ...(values.category && !categories.some((c) => c.name === values.category)
      ? [{ id: -1, name: values.category, slug: "", color: "#8c8c8c" }]
      : []),
  ].map((c) => ({
    value: c.name,
    label: (
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: c.color || "#059669" }}
        />
        <span>{c.name}</span>
      </div>
    ),
  }))

  const saveButtons = (
    <>
      <Button
        onClick={() => handleSave("DRAFT")}
        loading={saving === "DRAFT"}
        disabled={saving !== null && saving !== "DRAFT"}
        className="!rounded-lg"
      >
        {wasPublished ? "Chuyển về nháp" : "Lưu nháp"}
      </Button>
      <Button
        type="primary"
        onClick={() => handleSave("PUBLISHED")}
        loading={saving === "PUBLISHED"}
        disabled={saving !== null && saving !== "PUBLISHED"}
        className="!rounded-lg !bg-[#059669] font-medium shadow-sm hover:!bg-[#047857]"
      >
        {wasPublished ? "Cập nhật" : "Xuất bản"}
      </Button>
    </>
  )

  return (
    <div className="space-y-6 font-sans">
      {modalContextHolder}
      {/* Thanh tác vụ */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#f0f0f0] bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center">
        <Link
          href="/admin/posts"
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-medium text-[#595959] transition-colors hover:text-[#059669]"
        >
          <ArrowLeftOutlined />
          Quay lại danh sách bài viết
          {dirty && <span className="text-[#8c8c8c]">· Chưa lưu</span>}
        </Link>

        <div className="flex items-center gap-3">
          <Radio.Group
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            optionType="button"
            buttonStyle="solid"
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
          {saveButtons}
        </div>
      </div>

      {activeTab === "preview" && (
        <div className="article-preview overflow-hidden rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
          <ArticleView
            preview
            title={values.title || "Tiêu đề bài viết"}
            excerpt={values.excerpt}
            content={previewHtml}
            category={values.category}
            author={values.author || DEFAULT_AUTHOR}
            coverImageUrl={coverSrc}
            backgroundColor={values.backgroundColor || null}
            publishedAt={initial?.publishedAt || new Date().toISOString()}
            readingTimeMinutes={readingMinutes(values.content)}
            toc={getTableOfContents(previewHtml)}
          />
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-6 lg:grid-cols-12",
          activeTab === "preview" && "hidden"
        )}
      >
        {/* Cột trái: nội dung */}
        <div className="space-y-6 lg:col-span-8">
          <Card className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">
                  Tiêu đề <span className="text-[#ff4d4f]">*</span>
                </label>
                <Input
                  size="large"
                  placeholder="VD: Định hướng Quy hoạch điện 8 (PDP8) cho nhà đầu tư quốc tế"
                  value={values.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="rounded-lg font-medium text-[#1f1f1f]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">
                  Đường dẫn <span className="text-[#ff4d4f]">*</span>
                </label>
                <Space.Compact className="w-full">
                  <span className="flex items-center rounded-l-lg border border-r-0 border-[#d9d9d9] bg-[#fafafa] px-3 font-mono text-xs text-[#8c8c8c]">
                    /blog/
                  </span>
                  <Input
                    placeholder="dinh-huong-pdp8-cho-nha-dau-tu"
                    value={values.slug}
                    onChange={(e) => {
                      setSlugTouched(true)
                      set("slug", e.target.value)
                    }}
                    onBlur={() => set("slug", slugify(values.slug))}
                    className="font-mono text-xs text-[#595959]"
                  />
                </Space.Compact>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">
                  Tóm tắt
                  <span className="ml-1 font-normal text-[#8c8c8c]">
                    — hiện ở danh sách bài và kết quả Google
                  </span>
                </label>
                <TextArea
                  rows={2}
                  maxLength={300}
                  showCount
                  placeholder="1–2 câu nêu ý chính của bài"
                  value={values.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  className="rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-xs font-semibold text-slate-900">
                  Nội dung <span className="text-[#ff4d4f]">*</span>
                </label>

                <RichArticleEditor
                  paperColor={values.backgroundColor || undefined}
                  value={values.content}
                  onChange={(html) => set("content", html)}
                  placeholder="Viết nội dung, hoặc gõ / để chèn…"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Cột phải: thuộc tính */}
        <div className="space-y-6 lg:col-span-4">
          <Card
            title={<span className="text-xs font-bold text-[#1f1f1f]">Xuất bản</span>}
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <div className="space-y-4 text-xs text-[#595959]">
              <p>
                Trạng thái:{" "}
                <span className="font-semibold text-[#1f1f1f]">
                  {initial?.status === "PUBLISHED"
                    ? `Đã xuất bản ${formatDate(initial.publishedAt)}`
                    : initial?.status === "ARCHIVED"
                      ? "Đã lưu trữ"
                      : "Bản nháp"}
                </span>
              </p>
              <div className="flex gap-2 [&>*]:flex-1">{saveButtons}</div>
            </div>
          </Card>

          <Card
            title={
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1f1f1f]">Chuyên mục</span>
                <Button
                  type="link"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    categoryForm.resetFields()
                    setCategoryModalOpen(true)
                  }}
                  className="p-0 text-xs text-[#059669]"
                >
                  Thêm mới
                </Button>
              </div>
            }
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <Select
              value={values.category || undefined}
              onChange={(v) => set("category", v)}
              className="w-full"
              placeholder="Chọn chuyên mục"
              options={categoryOptions}
            />
          </Card>

          <Card
            title={
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1f1f1f]">Ảnh bìa</span>
                {values.coverImageUrl && (
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => set("coverImageUrl", "")}
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
              {coverSrc ? (
                <div className="overflow-hidden rounded-lg border border-[#e8e8e8] bg-[#fafafa]">
                  <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                    <Image
                      src={coverSrc}
                      alt="Ảnh bìa"
                      className="h-full w-full object-cover"
                      fallback={DEFAULT_COVER}
                    />
                  </div>
                  <div className="flex justify-end p-2.5">
                    <Upload {...coverUploadProps}>
                      <Button
                        size="small"
                        icon={<UploadOutlined />}
                        loading={uploadingCover}
                        className="text-xs"
                      >
                        Đổi ảnh
                      </Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                <Upload.Dragger
                  {...coverUploadProps}
                  className="!border-[#d9d9d9] !bg-[#fafafa] p-4 hover:!border-[#059669]"
                >
                  <p className="ant-upload-drag-icon !mb-1">
                    <PictureOutlined className="!text-2xl text-[#059669]" />
                  </p>
                  <p className="text-xs font-semibold text-[#262626]">
                    {uploadingCover ? "Đang tải lên…" : "Kéo thả hoặc nhấp để chọn ảnh"}
                  </p>
                  <p className="text-[11px] text-[#8c8c8c]">Tối đa {MAX_UPLOAD_MB}MB</p>
                </Upload.Dragger>
              )}

              <Button
                block
                icon={<PictureOutlined />}
                onClick={() => setPickerOpen(true)}
                className="!rounded-lg text-xs"
              >
                Chọn từ thư viện ảnh
              </Button>

              <div>
                <label className="mb-1 block text-xs text-[#8c8c8c]">Hoặc nhập URL ảnh</label>
                <Input
                  size="small"
                  placeholder="https://… hoặc /images/wind.jpg"
                  value={values.coverImageUrl}
                  onChange={(e) => set("coverImageUrl", e.target.value)}
                  className="rounded font-mono text-xs"
                />
              </div>
            </div>
          </Card>

          <Card
            title={<span className="text-xs font-bold text-[#1f1f1f]">Màu nền bài</span>}
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {ARTICLE_BACKGROUNDS.map((c) => {
                  const selected = values.backgroundColor === c.value
                  return (
                    <Tooltip key={c.label} title={c.label}>
                      <button
                        type="button"
                        aria-label={c.label}
                        aria-pressed={selected}
                        onClick={() => set("backgroundColor", c.value)}
                        className={cn(
                          "h-8 w-8 rounded-full ring-1 ring-black/10 transition",
                          selected ? "ring-2 ring-[#1f1f1f] ring-offset-2" : "hover:scale-110"
                        )}
                        style={{ backgroundColor: c.value || DEFAULT_ARTICLE_BG }}
                      />
                    </Tooltip>
                  )
                })}
                <ColorPicker
                  disabledAlpha
                  value={values.backgroundColor || DEFAULT_ARTICLE_BG}
                  onChangeComplete={(c) => set("backgroundColor", c.toHexString().toLowerCase())}
                  presets={[]}
                >
                  <Tooltip title="Màu khác">
                    <button
                      type="button"
                      aria-label="Chọn màu khác"
                      className={cn(
                        "h-8 w-8 rounded-full ring-1 ring-black/10 transition hover:scale-110",
                        customBg && "ring-2 ring-[#1f1f1f] ring-offset-2"
                      )}
                      style={{
                        background: customBg
                          ? values.backgroundColor
                          : "conic-gradient(#efe7d8, #edf1ea, #e9efef, #faf7f0, #efe7d8)",
                      }}
                    />
                  </Tooltip>
                </ColorPicker>
              </div>
              <p className="text-xs text-[#8c8c8c]">
                {values.backgroundColor
                  ? `${ARTICLE_BACKGROUNDS.find((c) => c.value === values.backgroundColor)?.label ?? "Màu tuỳ chọn"} · ${values.backgroundColor}`
                  : "Mặc định của website"}
              </p>
              {values.backgroundColor && isTooDarkForText(values.backgroundColor) && (
                <p className="text-xs text-[#d4380d]">
                  Màu này khá tối, chữ trong bài sẽ khó đọc. Nên chọn màu sáng hơn.
                </p>
              )}
            </div>
          </Card>

          <Card
            title={<span className="text-xs font-bold text-[#1f1f1f]">Tác giả</span>}
            className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          >
            <Input
              value={values.author}
              onChange={(e) => set("author", e.target.value)}
              className="rounded-md text-xs font-medium"
            />
          </Card>
        </div>
      </div>

      <MediaPicker
        title="Chọn ảnh bìa"
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => set("coverImageUrl", url)}
      />

      <Modal
        title="Chuyên mục mới"
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        onOk={handleQuickCreateCategory}
        confirmLoading={categorySubmitting}
        okText="Tạo chuyên mục"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={categoryForm} layout="vertical" className="mt-3">
          <Form.Item
            name="name"
            label="Tên chuyên mục"
            rules={[{ required: true, message: "Vui lòng nhập tên chuyên mục" }]}
          >
            <Input
              placeholder="VD: Thị trường điện gió ngoài khơi"
              onChange={(e) => categoryForm.setFieldsValue({ slug: slugify(e.target.value) })}
            />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Đường dẫn"
            rules={[{ required: true, message: "Vui lòng nhập đường dẫn" }]}
          >
            <Input placeholder="thi-truong-dien-gio" className="font-mono text-xs" />
          </Form.Item>
          <Form.Item name="color" label="Màu nhận diện" initialValue="#059669">
            <Select
              options={[
                { value: "#059669", label: "Xanh ngọc" },
                { value: "#10b981", label: "Xanh lá" },
                { value: "#722ed1", label: "Tím" },
                { value: "#fa8c16", label: "Cam" },
                { value: "#13c2c2", label: "Xanh lơ" },
              ].map((o) => ({
                value: o.value,
                label: (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: o.value }}
                    />
                    {o.label}
                  </div>
                ),
              }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={2} placeholder="Mô tả ngắn về chuyên mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExtension from "@tiptap/extension-link"
import ImageExtension from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Code2,
  Eye,
  FileCode,
  Sparkles,
} from "lucide-react"
import { Tooltip, Modal, Input, message } from "antd"
import { adminUpload } from "@/lib/api/admin-client"
import { MediaPicker } from "@/components/admin/media-picker"

interface RichArticleEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichArticleEditor({
  value,
  onChange,
  placeholder = "Bắt đầu soạn thảo bài viết phân tích chuyên sâu tại đây... Bạn có thể định dạng tiêu đề, danh sách, trích dẫn và chèn hình ảnh trực tiếp.",
  minHeight = "460px",
}: RichArticleEditorProps) {
  const [mode, setMode] = React.useState<"visual" | "html">("visual")
  const [linkModalOpen, setLinkModalOpen] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState("")
  const [imageModalOpen, setImageModalOpen] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState("")
  const [uploadingImage, setUploadingImage] = React.useState(false)
  const [pickerOpen, setPickerOpen] = React.useState(false)

  const isInternalChangeRef = React.useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-700 underline font-medium hover:text-emerald-800 transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "article-body focus:outline-none min-h-[380px] px-8 py-6",
      },
    },
    onUpdate: ({ editor: ed }) => {
      isInternalChangeRef.current = true
      const html = ed.getHTML()
      onChange(html)
    },
  })

  // Cập nhật nội dung editor khi prop value thay đổi từ bên ngoài
  React.useEffect(() => {
    if (!editor) return
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false
      return
    }
    const currentHTML = editor.getHTML()
    if (value !== currentHTML) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  }, [value, editor])

  const setLink = () => {
    if (!editor) return
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      setLinkModalOpen(false)
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    setLinkModalOpen(false)
    setLinkUrl("")
  }

  const insertImage = () => {
    if (!editor || !imageUrl) return
    editor.chain().focus().setImage({ src: imageUrl }).run()
    setImageModalOpen(false)
    setImageUrl("")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const uploadedUrl = await adminUpload(file)
      editor?.chain().focus().setImage({ src: uploadedUrl }).run()
      message.success("Đã chèn hình ảnh thành công!")
      setImageModalOpen(false)
    } catch {
      message.error("Không thể tải ảnh lên máy chủ. Bạn có thể chèn bằng đường link URL.")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  // Quick insertion helpers for rich financial blog formatting
  const insertCalloutBox = () => {
    if (!editor) return
    const calloutHTML = `
      <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
        <strong style="color: #065f46; display: block; margin-bottom: 6px; font-size: 14px;">💡 ĐIỂM NHẤN CHIẾN LƯỢC / PHÂN TÍCH THƯƠNG VỤ:</strong>
        <span style="color: #1f2937; font-size: 14px; line-height: 1.6;">Nhập nội dung nhận định thể chế, cơ chế DPPA hoặc rủi ro pháp lý cần lưu ý tại đây...</span>
      </div>
    `
    editor.chain().focus().insertContent(calloutHTML).run()
  }

  const insertKeyStatBento = () => {
    if (!editor) return
    const bentoHTML = `
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 24px 0; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; padding: 12px 8px; background: white; border-radius: 8px; border: 1px solid #f1f5f9;">
          <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Tổng công suất</div>
          <div style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px;">150 MW</div>
        </div>
        <div style="text-align: center; padding: 12px 8px; background: white; border-radius: 8px; border: 1px solid #f1f5f9;">
          <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Định giá dự kiến</div>
          <div style="font-size: 20px; font-weight: 700; color: #059669; margin-top: 4px;">$180M</div>
        </div>
        <div style="text-align: center; padding: 12px 8px; background: white; border-radius: 8px; border: 1px solid #f1f5f9;">
          <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Tiến độ COD</div>
          <div style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px;">Q4/2026</div>
        </div>
      </div>
    `
    editor.chain().focus().insertContent(bentoHTML).run()
  }

  if (!editor) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-400">
        Đang khởi tạo trình soạn thảo bài viết...
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all focus-within:border-emerald-500 focus-within:shadow-[0_4px_20px_rgba(5,150,105,0.08)]">
      {/* Top Floating-style Editor Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 backdrop-blur-sm select-none">
        {/* Left Toolbar Items: Rich formatting controls */}
        <div className="flex flex-wrap items-center gap-1 text-slate-700">
          <Tooltip title="Tiêu đề mục lớn (H2)">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Heading2 className="h-4 w-4" />
              <span>H2</span>
            </button>
          </Tooltip>

          <Tooltip title="Tiêu đề mục con (H3)">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Heading3 className="h-4 w-4" />
              <span>H3</span>
            </button>
          </Tooltip>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <Tooltip title="In đậm (Bold - Ctrl+B)">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                editor.isActive("bold")
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Bold className="h-4 w-4" />
            </button>
          </Tooltip>

          <Tooltip title="In nghiêng (Italic - Ctrl+I)">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                editor.isActive("italic")
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Italic className="h-4 w-4" />
            </button>
          </Tooltip>

          <Tooltip title="Đoạn trích dẫn chiến lược (Blockquote)">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                editor.isActive("blockquote")
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Quote className="h-4 w-4" />
            </button>
          </Tooltip>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <Tooltip title="Danh sách đầu mục (Bullet List)">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </Tooltip>

          <Tooltip title="Danh sách số thứ tự (Ordered List)">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                editor.isActive("orderedList")
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <ListOrdered className="h-4 w-4" />
            </button>
          </Tooltip>

          <Tooltip title="Đường kẻ phân cách nội dung (Divider)">
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-200/70"
            >
              <Minus className="h-4 w-4" />
            </button>
          </Tooltip>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <Tooltip title="Chèn liên kết (Link)">
            <button
              type="button"
              onClick={() => {
                setLinkUrl(editor.getAttributes("link").href || "")
                setLinkModalOpen(true)
              }}
              className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs transition-colors ${
                editor.isActive("link")
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Link</span>
            </button>
          </Tooltip>

          <Tooltip title="Chèn hình ảnh vào nội dung">
            <button
              type="button"
              onClick={() => setImageModalOpen(true)}
              className="flex h-8 items-center gap-1 rounded-lg border border-emerald-200/60 bg-emerald-50 px-2.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100/70"
            >
              <ImageIcon className="h-3.5 w-3.5 text-emerald-700" />
              <span>Chèn ảnh</span>
            </button>
          </Tooltip>

          {/* Quick Luxury Templates */}
          <Tooltip title="Chèn khung Điểm nhấn chiến lược (Callout)">
            <button
              type="button"
              onClick={insertCalloutBox}
              className="hidden h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200/70 sm:flex"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Box Điểm nhấn</span>
            </button>
          </Tooltip>

          <Tooltip title="Chèn bảng 3 chỉ số Bento tài chính (Key Stats)">
            <button
              type="button"
              onClick={insertKeyStatBento}
              className="hidden h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200/70 md:flex"
            >
              <Code2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Bento Chỉ số</span>
            </button>
          </Tooltip>
        </div>

        {/* Right Toolbar: Undo, Redo, Mode Switch */}
        <div className="flex items-center gap-1.5">
          <Tooltip title="Hoàn tác (Ctrl+Z)">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200/70 disabled:opacity-30"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
          </Tooltip>

          <Tooltip title="Làm lại (Ctrl+Y)">
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200/70 disabled:opacity-30"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </Tooltip>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          {/* Switch between Visual Editor & Raw HTML */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setMode("visual")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                mode === "visual"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Trực quan</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("html")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                mode === "html"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCode className="h-3 w-3" />
              <span>Mã HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      {mode === "visual" ? (
        <div style={{ minHeight }} className="cursor-text bg-white">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div className="bg-slate-900 p-4 font-mono">
          <textarea
            value={value}
            onChange={(e) => {
              const newHtml = e.target.value
              onChange(newHtml)
              editor.commands.setContent(newHtml, { emitUpdate: false })
            }}
            rows={18}
            className="w-full resize-y bg-transparent text-xs leading-relaxed text-emerald-400 focus:outline-none"
            placeholder="Nhập hoặc chỉnh sửa trực tiếp mã HTML/Markdown tại đây..."
          />
        </div>
      )}

      {/* Bottom Status & Word Counter Bar */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            Độ dài:{" "}
            <strong className="text-slate-700">
              {editor.storage.characterCount?.words?.() ||
                value.split(/\s+/).filter(Boolean).length}
            </strong>{" "}
            từ
          </span>
          <span>•</span>
          <span className="font-medium text-emerald-700">
            Trình soạn thảo cao cấp TipTap Engine v3.34
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>Hỗ trợ định dạng chuẩn ấn phẩm Léargas Energy Partners</span>
        </div>
      </div>

      {/* Modal Chèn Link */}
      <Modal
        title="Chèn liên kết liên kết ngoài"
        open={linkModalOpen}
        onOk={setLink}
        onCancel={() => setLinkModalOpen(false)}
        okText="Áp dụng link"
        cancelText="Hủy"
        okButtonProps={{ className: "!bg-[#059669]" }}
      >
        <div className="space-y-3 py-2 font-sans">
          <label className="block text-xs font-semibold text-slate-700">
            Đường dẫn URL (Hỗ trợ https://...):
          </label>
          <Input
            placeholder="https://example.com/bao-cao-pdp8"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onPressEnter={setLink}
            autoFocus
          />
        </div>
      </Modal>

      {/* Modal Chèn Ảnh */}
      <Modal
        title="Chèn hình ảnh vào bài viết"
        open={imageModalOpen}
        onOk={insertImage}
        onCancel={() => setImageModalOpen(false)}
        okText="Chèn ảnh này"
        cancelText="Đóng"
        okButtonProps={{ className: "!bg-[#059669]" }}
      >
        <div className="space-y-4 py-2 font-sans">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Tải ảnh mới từ thiết bị:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploadingImage}
              className="block w-full cursor-pointer text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
            />
            {uploadingImage && (
              <p className="mt-1 animate-pulse text-xs text-emerald-600">Đang tải ảnh lên...</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            Chọn ảnh có sẵn trong thư viện
          </button>

          <div className="my-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-medium text-slate-400">Hoặc dùng link URL</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Đường dẫn URL ảnh (https://... hoặc /images/wind.jpg):
            </label>
            <Input
              placeholder="https://images.unsplash.com/photo-1466611653911-95081537e5b7 hoặc /images/wind.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onPressEnter={insertImage}
            />
          </div>
        </div>
      </Modal>
      <MediaPicker
        title="Chèn ảnh từ thư viện"
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          editor?.chain().focus().setImage({ src: url }).run()
          setImageModalOpen(false)
        }}
      />
    </div>
  )
}

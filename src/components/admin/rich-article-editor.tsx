"use client"

import * as React from "react"
import { useEditor, useEditorState, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { TableKit } from "@tiptap/extension-table"
import Typography from "@tiptap/extension-typography"
import FileHandler from "@tiptap/extension-file-handler"
import { DragHandle } from "@tiptap/extension-drag-handle-react"
import type { Editor } from "@tiptap/core"
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
  Pilcrow,
  Table as TableIcon,
  GripVertical,
  Rows3,
  Columns3,
  Trash2,
  Code2,
} from "lucide-react"
import { Tooltip, Modal, Input } from "antd"
import { toast } from "sonner"
import { adminUpload } from "@/lib/api/admin-client"
import { MediaPicker } from "@/components/admin/media-picker"
import { cn } from "@/lib/utils"
import { SlashCommand } from "@/components/admin/editor/slash-command"

interface RichArticleEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  /** Paper colour of the writing area, so it matches the published article. */
  paperColor?: string
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"]
const MAX_UPLOAD_MB = 10

/** Upload dropped or pasted images and insert them where they landed. */
async function uploadAndInsert(editor: Editor, files: File[], pos?: number) {
  for (const file of files) {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      toast.error(`"${file.name}" is larger than ${MAX_UPLOAD_MB}MB`)
      continue
    }
    const id = toast.loading(`Uploading "${file.name}"…`)
    try {
      const src = await adminUpload(file)
      const node = { type: "image", attrs: { src, alt: "" } }
      if (pos === undefined) editor.chain().focus().insertContent(node).run()
      else editor.chain().focus().insertContentAt(pos, node).run()
      toast.success("Image inserted", { id })
    } catch {
      toast.error(`Could not upload "${file.name}"`, { id })
    }
  }
}

export function RichArticleEditor({
  value,
  onChange,
  placeholder = "Start writing, or type / to insert…",
  minHeight = "460px",
  paperColor,
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
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      TableKit.configure({ table: { resizable: false } }),
      Typography,
      FileHandler.configure({
        allowedMimeTypes: IMAGE_TYPES,
        onDrop: (ed, files, pos) => void uploadAndInsert(ed, files, pos),
        onPaste: (ed, files) => void uploadAndInsert(ed, files),
      }),
      // State setters are stable, so the slash menu can open the image dialog directly.
      SlashCommand.configure({ onImage: () => setImageModalOpen(true) }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => (node.type.name === "heading" ? "Heading" : placeholder),
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "article-body focus:outline-none px-10 py-12",
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
      toast.success("Image inserted")
      setImageModalOpen(false)
    } catch {
      toast.error("Could not upload the image. You can insert it by URL instead.")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  // Toolbar state; re-renders only when one of these values changes.
  const active = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      paragraph: !!ed && !ed.isActive("heading") && !ed.isActive("blockquote"),
      h2: !!ed?.isActive("heading", { level: 2 }),
      h3: !!ed?.isActive("heading", { level: 3 }),
      bold: !!ed?.isActive("bold"),
      italic: !!ed?.isActive("italic"),
      link: !!ed?.isActive("link"),
      quote: !!ed?.isActive("blockquote"),
      bullet: !!ed?.isActive("bulletList"),
      ordered: !!ed?.isActive("orderedList"),
      table: !!ed?.isActive("table"),
      canUndo: !!ed?.can().undo(),
      canRedo: !!ed?.can().redo(),
    }),
  })

  // Stable callback: a new function each render would make BubbleMenu re-register in a loop.
  const modeRef = React.useRef(mode)
  React.useEffect(() => {
    modeRef.current = mode
  }, [mode])
  const shouldShowBubble = React.useCallback(
    ({
      editor: ed,
      state,
    }: {
      editor: NonNullable<typeof editor>
      state: { selection: { empty: boolean } }
    }) => modeRef.current === "visual" && !state.selection.empty && !ed.isActive("image"),
    []
  )

  if (!editor) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-400">
        Loading editor…
      </div>
    )
  }

  const words = value
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length
  const openLink = () => {
    setLinkUrl(editor.getAttributes("link").href || "")
    setLinkModalOpen(true)
  }

  return (
    <div className="rounded-xl border border-[#ececec] bg-white">
      {/* Toolbar: one row, sticks to the top while scrolling a long article */}
      <div className="sticky top-0 z-10 flex min-h-12 flex-wrap items-center gap-1 rounded-t-xl border-b border-[#f0f0f0] bg-white/95 px-2 py-2 backdrop-blur select-none">
        <ToolButton
          label="Undo (⌘Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!active?.canUndo}
        >
          <Undo2 />
        </ToolButton>
        <ToolButton
          label="Redo (⌘⇧Z)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!active?.canRedo}
        >
          <Redo2 />
        </ToolButton>
        <Divider />
        <ToolButton
          label="Paragraph"
          active={active?.paragraph}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow />
        </ToolButton>
        <ToolButton
          label="Heading (H2)"
          active={active?.h2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 />
        </ToolButton>
        <ToolButton
          label="Subheading (H3)"
          active={active?.h3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 />
        </ToolButton>
        <Divider />
        <ToolButton
          label="Bold (⌘B)"
          active={active?.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolButton>
        <ToolButton
          label="Italic (⌘I)"
          active={active?.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolButton>
        <ToolButton label="Link" active={active?.link} onClick={openLink}>
          <LinkIcon />
        </ToolButton>
        <Divider />
        <ToolButton
          label="Quote"
          active={active?.quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolButton>
        <ToolButton
          label="Bullet list"
          active={active?.bullet}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolButton>
        <ToolButton
          label="Numbered list"
          active={active?.ordered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolButton>
        <ToolButton
          label="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus />
        </ToolButton>
        <Divider />
        <ToolButton
          label="Image (or drag / paste one into the post)"
          onClick={() => setImageModalOpen(true)}
        >
          <ImageIcon />
        </ToolButton>
        <ToolButton
          label="Table"
          active={active?.table}
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon />
        </ToolButton>

        {/* Table tools appear only while the cursor is inside a table */}
        {active?.table && (
          <>
            <Divider />
            <ToolButton
              label="Add row below"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Rows3 />
            </ToolButton>
            <ToolButton
              label="Add column to the right"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <Columns3 />
            </ToolButton>
            <ToolButton label="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>
              <Rows3 className="opacity-50" />
            </ToolButton>
            <ToolButton
              label="Delete column"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <Columns3 className="opacity-50" />
            </ToolButton>
            <ToolButton
              label="Delete table"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <Trash2 />
            </ToolButton>
          </>
        )}

        <div className="ml-auto">
          <ToolButton
            label={mode === "html" ? "Back to editor" : "View / edit HTML"}
            active={mode === "html"}
            onClick={() => setMode(mode === "html" ? "visual" : "html")}
          >
            <Code2 />
          </ToolButton>
        </div>
      </div>

      {/* Grip left of each block: drag to reorder paragraphs, headings, images… */}
      {mode === "visual" && (
        <DragHandle editor={editor}>
          <div
            className="flex h-6 w-5 cursor-grab items-center justify-center rounded text-[#bfb8ac] transition-colors hover:bg-black/5 hover:text-[#595959] active:cursor-grabbing"
            title="Drag to move"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </DragHandle>
      )}

      {/* Quick formatting when text is selected */}
      <BubbleMenu
        editor={editor}
        shouldShow={shouldShowBubble}
        className="flex items-center gap-0.5 rounded-lg bg-[#1f1f1f] p-1 shadow-lg"
      >
        {[
          {
            label: "H2",
            icon: <Heading2 />,
            active: active?.h2,
            run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          },
          {
            label: "H3",
            icon: <Heading3 />,
            active: active?.h3,
            run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          },
          {
            label: "Bold",
            icon: <Bold />,
            active: active?.bold,
            run: () => editor.chain().focus().toggleBold().run(),
          },
          {
            label: "Italic",
            icon: <Italic />,
            active: active?.italic,
            run: () => editor.chain().focus().toggleItalic().run(),
          },
          { label: "Link", icon: <LinkIcon />, active: active?.link, run: openLink },
          {
            label: "Quote",
            icon: <Quote />,
            active: active?.quote,
            run: () => editor.chain().focus().toggleBlockquote().run(),
          },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            title={b.label}
            onClick={b.run}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors [&_svg]:h-3.5 [&_svg]:w-3.5",
              b.active
                ? "bg-white/15 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            {b.icon}
          </button>
        ))}
      </BubbleMenu>

      {/* Body: same paper colour and reading column as the published article */}
      {mode === "visual" ? (
        <div
          style={{ minHeight, ...(paperColor ? { backgroundColor: paperColor } : {}) }}
          className="cursor-text bg-stone-soft transition-colors"
          onClick={() => !editor.isFocused && editor.commands.focus("end")}
        >
          <div className="mx-auto max-w-[760px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => {
            const newHtml = e.target.value
            onChange(newHtml)
            editor.commands.setContent(newHtml, { emitUpdate: false })
          }}
          style={{ minHeight }}
          spellCheck={false}
          className="block w-full resize-y bg-[#1b1f1d] p-6 font-mono text-xs leading-relaxed text-[#cfe3d8] focus:outline-none"
        />
      )}

      <div className="flex items-center justify-between rounded-b-xl border-t border-[#f0f0f0] px-4 py-2 text-[11px] text-[#8c8c8c]">
        <span>
          {words.toLocaleString("en-GB")} {words === 1 ? "word" : "words"} · about{" "}
          {Math.max(1, Math.ceil(words / 200))} min read
        </span>
        <span className="hidden sm:inline">
          Type / to insert · Select text to format · Drop images into the post
        </span>
      </div>

      {/* Modal Chèn Link */}
      <Modal
        title="Insert link"
        open={linkModalOpen}
        onOk={setLink}
        onCancel={() => setLinkModalOpen(false)}
        okText="Apply"
        cancelText="Cancel"
        okButtonProps={{ className: "!bg-[#059669]" }}
      >
        <div className="space-y-3 py-2 font-sans">
          <label className="block text-xs font-semibold text-slate-700">URL (https://…)</label>
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
        title="Insert image"
        open={imageModalOpen}
        onOk={insertImage}
        onCancel={() => setImageModalOpen(false)}
        okText="Insert"
        cancelText="Close"
        okButtonProps={{ className: "!bg-[#059669]" }}
      >
        <div className="space-y-4 py-2 font-sans">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Upload from your computer
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploadingImage}
              className="block w-full cursor-pointer text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
            />
            {uploadingImage && (
              <p className="mt-1 animate-pulse text-xs text-emerald-600">Uploading…</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            Choose from media library
          </button>

          <div className="my-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-medium text-slate-400">Or use a URL</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Image URL (https://… or /images/wind.jpg)
            </label>
            <Input
              placeholder="https://… or /images/wind.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onPressEnter={insertImage}
            />
          </div>
        </div>
      </Modal>
      <MediaPicker
        title="Insert from media library"
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

function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip title={label} mouseEnterDelay={0.4}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4",
          active
            ? "bg-[#e8f2ec] text-[#065f46]"
            : "text-[#595959] hover:bg-[#f5f5f5] hover:text-[#1f1f1f]"
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-[#f0f0f0]" />
}

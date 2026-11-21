"use client"

import * as React from "react"
import { Extension, type Editor, type Range } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from "@tiptap/suggestion"
import { computePosition, flip, offset, shift } from "@floating-ui/dom"
import {
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Table as TableIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export interface SlashItem {
  title: string
  hint: string
  keywords: string
  icon: React.ReactNode
  run: (editor: Editor, range: Range) => void
}

export interface SlashCommandOptions {
  /** Opens the editor's image dialog (upload, library or URL). */
  onImage: () => void
}

function buildItems(onImage: () => void): SlashItem[] {
  return [
    {
      title: "Text",
      hint: "Plain paragraph",
      keywords: "van ban doan paragraph text",
      icon: <Pilcrow />,
      run: (e, r) => e.chain().focus().deleteRange(r).setParagraph().run(),
    },
    {
      title: "Heading",
      hint: "Section title, listed in the contents",
      keywords: "tieu de muc h2 heading",
      icon: <Heading2 />,
      run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 2 }).run(),
    },
    {
      title: "Subheading",
      hint: "Smaller title inside a section",
      keywords: "tieu de phu h3 subheading",
      icon: <Heading3 />,
      run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 3 }).run(),
    },
    {
      title: "Bullet list",
      hint: "Simple list",
      keywords: "danh sach bullet list",
      icon: <List />,
      run: (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run(),
    },
    {
      title: "Numbered list",
      hint: "01, 02, 03…",
      keywords: "danh sach so number ordered",
      icon: <ListOrdered />,
      run: (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run(),
    },
    {
      title: "Quote",
      hint: "Highlighted statement",
      keywords: "trich dan quote",
      icon: <Quote />,
      run: (e, r) => e.chain().focus().deleteRange(r).setBlockquote().run(),
    },
    {
      title: "Table",
      hint: "3 × 3 data table",
      keywords: "bang table so lieu",
      icon: <TableIcon />,
      run: (e, r) =>
        e
          .chain()
          .focus()
          .deleteRange(r)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      title: "Image",
      hint: "Upload or pick from the library",
      keywords: "anh hinh image photo",
      icon: <ImageIcon />,
      run: (e, r) => {
        e.chain().focus().deleteRange(r).run()
        onImage()
      },
    },
    {
      title: "Divider",
      hint: "Separate two sections",
      keywords: "duong phan cach divider hr",
      icon: <Minus />,
      run: (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run(),
    },
  ]
}

/** Strip Vietnamese accents so "/tieu" matches "Tiêu đề". */
function fold(text: string) {
  return text
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

interface SlashMenuHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
}

const SlashMenu = React.forwardRef<SlashMenuHandle, SuggestionProps<SlashItem, SlashItem>>(
  function SlashMenu({ items, command }, ref) {
    const [index, setIndex] = React.useState(0)
    const listRef = React.useRef<HTMLDivElement>(null)

    // Reset the highlight when the filtered list changes (adjusting state during render).
    const [prevItems, setPrevItems] = React.useState(items)
    if (prevItems !== items) {
      setPrevItems(items)
      setIndex(0)
    }

    React.useEffect(() => {
      listRef.current
        ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
        ?.scrollIntoView({ block: "nearest" })
    }, [index])

    React.useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (!items.length) return false
        if (event.key === "ArrowDown") {
          setIndex((i) => (i + 1) % items.length)
          return true
        }
        if (event.key === "ArrowUp") {
          setIndex((i) => (i - 1 + items.length) % items.length)
          return true
        }
        if (event.key === "Enter") {
          const item = items[index]
          if (item) command(item)
          return true
        }
        return false
      },
    }))

    if (!items.length) {
      return (
        <div className="w-64 rounded-xl bg-white p-3 text-xs text-[#8c8c8c] shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
          No matching blocks
        </div>
      )
    }

    return (
      <div
        ref={listRef}
        className="max-h-80 w-64 overflow-y-auto rounded-xl bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5"
      >
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            data-index={i}
            onMouseEnter={() => setIndex(i)}
            onMouseDown={(e) => {
              e.preventDefault()
              command(item)
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors",
              i === index ? "bg-[#f3f1ec]" : "hover:bg-[#f7f6f3]"
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f7f6f3] text-[#434343] [&_svg]:h-4 [&_svg]:w-4">
              {item.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-[#1f1f1f]">{item.title}</span>
              <span className="block truncate text-[11px] text-[#8c8c8c]">{item.hint}</span>
            </span>
          </button>
        ))}
      </div>
    )
  }
)

/** Type "/" at the start of a word to open a quick-insert menu (Notion-style). */
export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: "slashCommand",

  addOptions() {
    return { onImage: () => {} }
  },

  addProseMirrorPlugins() {
    const items = buildItems(() => this.options.onImage())

    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: "/",
        // Not inside tables or code, where "/" is ordinary text.
        allow: ({ editor }) => !editor.isActive("table") && !editor.isActive("codeBlock"),
        items: ({ query }) => {
          const q = fold(query)
          return items.filter((it) => !q || fold(`${it.title} ${it.keywords}`).includes(q))
        },
        command: ({ editor, range, props }) => props.run(editor, range),
        render: () => {
          let renderer: ReactRenderer<
            SlashMenuHandle,
            SuggestionProps<SlashItem, SlashItem>
          > | null = null
          let el: HTMLDivElement | null = null
          let latest: SuggestionProps<SlashItem, SlashItem> | null = null
          // Keep the menu glued to the caret when the page or a scroll container moves.
          const follow = () => latest && place(latest)

          const place = (props: SuggestionProps<SlashItem, SlashItem>) => {
            latest = props
            const rect = props.clientRect?.()
            if (!rect || !el) return
            void computePosition({ getBoundingClientRect: () => rect }, el, {
              placement: "bottom-start",
              strategy: "fixed",
              middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
              if (el) Object.assign(el.style, { left: `${x}px`, top: `${y}px` })
            })
          }

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashMenu, { props, editor: props.editor })
              el = document.createElement("div")
              Object.assign(el.style, { position: "fixed", zIndex: "1100", left: "0", top: "0" })
              el.appendChild(renderer.element)
              document.body.appendChild(el)
              place(props)
              window.addEventListener("scroll", follow, true)
              window.addEventListener("resize", follow)
            },
            onUpdate: (props) => {
              renderer?.updateProps(props)
              place(props)
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                el?.remove()
                return true
              }
              return renderer?.ref?.onKeyDown(props) ?? false
            },
            onExit: () => {
              window.removeEventListener("scroll", follow, true)
              window.removeEventListener("resize", follow)
              el?.remove()
              renderer?.destroy()
              el = null
              renderer = null
            },
          }
        },
      }),
    ]
  },
})

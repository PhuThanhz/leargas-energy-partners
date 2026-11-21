"use client"

import * as React from "react"
import { Button, Input, Tooltip } from "antd"
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2 } from "lucide-react"

import { MediaPicker } from "@/components/admin/media-picker"
import { resolveMediaUrl } from "@/lib/api/admin-client"
import type { ImageRef } from "@/content/site"

import { emptyItem, type Field } from "./schema"

const { TextArea } = Input

type Obj = Record<string, unknown>

/** Renders the fields of one object (a section, or one item of a list). */
export function FieldsEditor({
  fields,
  value,
  onChange,
}: {
  fields: Field[]
  value: Obj
  onChange: (next: Obj) => void
}) {
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <FieldEditor
          key={field.key}
          field={field}
          value={value[field.key]}
          onChange={(v) => onChange({ ...value, [field.key]: v })}
        />
      ))}
    </div>
  )
}

function Label({ field }: { field: Field }) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-semibold text-[#262626]">{field.label}</label>
      {field.help && <p className="mt-0.5 text-[11px] text-[#8c8c8c]">{field.help}</p>}
    </div>
  )
}

export function FieldEditor({
  field,
  value,
  onChange,
  bare = false,
}: {
  field: Field
  value: unknown
  onChange: (next: unknown) => void
  /** Hide the label (used for single-field list items). */
  bare?: boolean
}) {
  const label = bare ? null : <Label field={field} />

  switch (field.type) {
    case "text":
    case "url":
      return (
        <div>
          {label}
          <Input
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.type === "url" ? "https://…" : undefined}
            className="rounded-lg"
          />
        </div>
      )
    case "textarea":
      return (
        <div>
          {label}
          <TextArea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 6 }}
            className="rounded-lg"
          />
        </div>
      )
    case "image":
      return (
        <div>
          {label}
          <ImageField value={(value as ImageRef) ?? { src: "", alt: "" }} onChange={onChange} />
        </div>
      )
    case "strings":
      return (
        <div>
          {label}
          <StringList
            value={(value as string[]) ?? []}
            itemLabel={field.itemLabel}
            onChange={onChange}
          />
        </div>
      )
    case "list":
      return (
        <div>
          {label}
          <ItemList field={field} value={(value as unknown[]) ?? []} onChange={onChange} />
        </div>
      )
  }
}

function ImageField({ value, onChange }: { value: ImageRef; onChange: (v: ImageRef) => void }) {
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const src = resolveMediaUrl(value.src)

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="group relative h-[84px] w-[128px] shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] ring-1 ring-black/5"
        title="Choose from media library"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of any URL
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-[#bfbfbf]">
            <ImageIcon className="h-6 w-6" />
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          Change
        </span>
      </button>
      <div className="min-w-0 flex-1 space-y-2">
        <Input
          size="small"
          value={value.src}
          onChange={(e) => onChange({ ...value, src: e.target.value })}
          placeholder="Image URL or /images/…"
          className="rounded font-mono text-xs"
        />
        <Input
          size="small"
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          placeholder="Description for screen readers and Google (alt text)"
          className="rounded text-xs"
        />
        <Button size="small" onClick={() => setPickerOpen(true)} className="text-xs">
          Choose from library
        </Button>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange({ ...value, src: url })}
      />
    </div>
  )
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item!)
  return next
}

function RowActions({
  index,
  total,
  onMove,
  onRemove,
  noun,
}: {
  index: number
  total: number
  onMove: (to: number) => void
  onRemove: () => void
  noun: string
}) {
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-md text-[#8c8c8c] transition-colors hover:bg-[#f5f5f5] hover:text-[#1f1f1f] disabled:opacity-30 disabled:hover:bg-transparent"
  return (
    <div className="flex shrink-0 items-center">
      <Tooltip title="Move up">
        <button
          type="button"
          className={btn}
          disabled={index === 0}
          onClick={() => onMove(index - 1)}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      <Tooltip title="Move down">
        <button
          type="button"
          className={btn}
          disabled={index === total - 1}
          onClick={() => onMove(index + 1)}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      <Tooltip title={`Remove ${noun.toLowerCase()}`}>
        <button type="button" className={`${btn} hover:!text-[#cf1322]`} onClick={onRemove}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
    </div>
  )
}

function StringList({
  value,
  itemLabel,
  onChange,
}: {
  value: string[]
  itemLabel: string
  onChange: (v: string[]) => void
}) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
            className="rounded-lg"
          />
          <RowActions
            index={i}
            total={value.length}
            noun={itemLabel}
            onMove={(to) => onChange(move(value, i, to))}
            onRemove={() => onChange(value.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <Button
        size="small"
        icon={<Plus className="h-3.5 w-3.5" />}
        onClick={() => onChange([...value, ""])}
        className="text-xs"
      >
        Add {itemLabel.toLowerCase()}
      </Button>
    </div>
  )
}

function ItemList({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>
  value: unknown[]
  onChange: (v: unknown[]) => void
}) {
  const single = field.fields.length === 1 && field.fields[0]!.key === ""

  const titleOf = (item: unknown, i: number) => {
    if (item && typeof item === "object") {
      const first = Object.values(item as Obj).find((v) => typeof v === "string" && v.trim())
      if (typeof first === "string") return first
    }
    return `${field.itemLabel} ${i + 1}`
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-xl bg-[#fafafa] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="truncate text-xs font-medium text-[#595959]">
              <span className="mr-2 font-mono text-[#bfbfbf]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {single ? `${field.itemLabel} ${i + 1}` : titleOf(item, i)}
            </span>
            <RowActions
              index={i}
              total={value.length}
              noun={field.itemLabel}
              onMove={(to) => onChange(move(value, i, to))}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
            />
          </div>
          {single ? (
            <FieldEditor
              bare
              field={field.fields[0]!}
              value={item}
              onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
            />
          ) : (
            <FieldsEditor
              fields={field.fields}
              value={(item as Obj) ?? {}}
              onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
            />
          )}
        </div>
      ))}
      <Button
        size="small"
        icon={<Plus className="h-3.5 w-3.5" />}
        onClick={() => onChange([...value, emptyItem(field.fields)])}
        className="text-xs"
      >
        Add {field.itemLabel.toLowerCase()}
      </Button>
    </div>
  )
}

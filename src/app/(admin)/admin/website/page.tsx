"use client"

import * as React from "react"
import { Button, Modal, Result, Spin } from "antd"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { FieldsEditor } from "@/components/admin/website/field-editor"
import { WEBSITE_SECTIONS } from "@/components/admin/website/schema"
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type SectionKey,
  type SiteContent,
} from "@/content/site"
import { adminFetch } from "@/lib/api/admin-client"
import { cn } from "@/lib/utils"

import { refreshSiteSafely } from "../posts/refresh-blog"

type Obj = Record<string, unknown>

export default function WebsiteContentPage() {
  const [saved, setSaved] = React.useState<SiteContent | null>(null)
  const [edited, setEdited] = React.useState<Set<string>>(new Set())
  const [draft, setDraft] = React.useState<SiteContent | null>(null)
  const [active, setActive] = React.useState<SectionKey>("hero")
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [modal, modalHolder] = Modal.useModal()

  const load = React.useCallback(async () => {
    setError(null)
    try {
      const data = await adminFetch<Record<string, unknown>>("/api/admin/content")
      const merged = mergeSiteContent(data)
      setSaved(merged)
      setDraft(merged)
      setEdited(new Set(Object.keys(data)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load website content")
    }
  }, [])

  React.useEffect(() => {
    let ignore = false
    adminFetch<Record<string, unknown>>("/api/admin/content")
      .then((data) => {
        if (ignore) return
        const merged = mergeSiteContent(data)
        setSaved(merged)
        setDraft(merged)
        setEdited(new Set(Object.keys(data)))
      })
      .catch((e: unknown) => {
        if (!ignore) setError(e instanceof Error ? e.message : "Could not load website content")
      })
    return () => {
      ignore = true
    }
  }, [])

  const isDirty = (key: SectionKey) =>
    !!saved && !!draft && JSON.stringify(saved[key]) !== JSON.stringify(draft[key])
  const anyDirty = WEBSITE_SECTIONS.some((s) => isDirty(s.key))

  React.useEffect(() => {
    if (!anyDirty) return
    const handler = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [anyDirty])

  if (error) {
    return (
      <Result
        status="warning"
        title="Could not load website content"
        subTitle={error}
        extra={
          <Button type="primary" className="!bg-[#059669]" onClick={load}>
            Try again
          </Button>
        }
      />
    )
  }

  if (!draft || !saved) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin />
      </div>
    )
  }

  const section = WEBSITE_SECTIONS.find((s) => s.key === active)!
  const dirty = isDirty(active)

  const save = async () => {
    setSaving(true)
    try {
      await adminFetch(`/api/admin/content/${active}`, {
        method: "PUT",
        body: JSON.stringify(draft[active]),
      })
      setSaved({ ...saved, [active]: draft[active] })
      setEdited(new Set(edited).add(active))
      const refreshed = await refreshSiteSafely()
      toast.success(`${section.label} saved`, {
        description: refreshed
          ? "The website shows the new version now."
          : "Saved. The website may take a moment to update.",
      })
    } catch (e) {
      toast.error("Could not save", { description: e instanceof Error ? e.message : undefined })
    } finally {
      setSaving(false)
    }
  }

  const reset = () =>
    modal.confirm({
      title: `Reset "${section.label}" to the original content?`,
      content: "Your edits to this section will be removed from the website.",
      okText: "Reset",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await adminFetch(`/api/admin/content/${active}`, { method: "DELETE" })
          const original = DEFAULT_SITE_CONTENT[active]
          setSaved({ ...saved, [active]: original })
          setDraft({ ...draft, [active]: original })
          const next = new Set(edited)
          next.delete(active)
          setEdited(next)
          await refreshSiteSafely()
          toast.success(`${section.label} reset to the original content`)
        } catch (e) {
          toast.error("Could not reset", {
            description: e instanceof Error ? e.message : undefined,
          })
        }
      },
    })

  return (
    <div className="space-y-6 font-sans">
      {modalHolder}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-[#1f1f1f]">Website</h1>
          <p className="mt-1 text-sm text-[#8c8c8c]">
            Edit the text and photos on the homepage, menu and footer.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Section list */}
        <nav className="h-fit rounded-xl bg-white p-2 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] lg:sticky lg:top-4">
          {WEBSITE_SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(s.key)}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                active === s.key
                  ? "bg-[#e8f2ec] font-medium text-[#065f46]"
                  : "text-[#434343] hover:bg-[#f5f5f5]"
              )}
            >
              <span className="truncate">{s.label}</span>
              {isDirty(s.key) ? (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a017]" title="Unsaved" />
              ) : edited.has(s.key) ? (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]"
                  title="Edited (differs from the original)"
                />
              ) : null}
            </button>
          ))}
          <p className="mt-2 border-t border-[#f0f0f0] px-3 pt-3 text-[11px] leading-relaxed text-[#8c8c8c]">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#d4a017] align-middle" />
            unsaved
            <span className="mr-1 ml-3 inline-block h-1.5 w-1.5 rounded-full bg-[#059669] align-middle" />
            edited
          </p>
        </nav>

        {/* Editor */}
        <div className="rounded-xl bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-[#f0f0f0] bg-white/95 px-6 py-4 backdrop-blur">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[#1f1f1f]">{section.label}</h2>
              <p className="text-xs text-[#8c8c8c]">{section.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={section.anchor}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 text-xs text-[#595959] hover:text-[#059669]"
              >
                View on website <ExternalLink className="h-3 w-3" />
              </a>
              {edited.has(active) && (
                <Button onClick={reset} className="!rounded-lg">
                  Reset to original
                </Button>
              )}
              <Button
                onClick={() => setDraft({ ...draft, [active]: saved[active] })}
                disabled={!dirty || saving}
                className="!rounded-lg"
              >
                Discard
              </Button>
              <Button
                type="primary"
                onClick={save}
                loading={saving}
                disabled={!dirty}
                className="!rounded-lg !bg-[#059669] hover:!bg-[#047857] disabled:!bg-[#d9d9d9]"
              >
                Save
              </Button>
            </div>
          </div>

          <div className="max-w-[760px] p-6">
            <FieldsEditor
              fields={section.fields}
              value={draft[active] as unknown as Obj}
              onChange={(next) => setDraft({ ...draft, [active]: next } as SiteContent)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

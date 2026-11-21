"use client"

import * as React from "react"
import { Button, Empty, Input, Modal, Spin, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { toast } from "sonner"

import { adminFetch, adminUpload, resolveMediaUrl } from "@/lib/api/admin-client"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: number
  fileName: string
  url: string
  fileType: string | null
  createdAt: string
}

interface MediaPickerProps {
  open: boolean
  onClose: () => void
  /** Called with the absolute URL of the chosen (or freshly uploaded) image. */
  onSelect: (url: string) => void
  title?: string
}

const MAX_UPLOAD_MB = 10

/** Modal grid over the media library: pick an existing image or upload a new one. */
export function MediaPicker({ open, onClose, onSelect, title = "Thư viện ảnh" }: MediaPickerProps) {
  const [items, setItems] = React.useState<MediaItem[] | null>(null)
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    let ignore = false
    adminFetch<MediaItem[]>("/api/admin/media")
      .then((data) => {
        if (!ignore) setItems(data.filter((m) => !m.fileType || m.fileType.startsWith("image/")))
      })
      .catch(() => {
        if (!ignore) {
          setItems([])
          toast.error("Không tải được thư viện ảnh")
        }
      })
    return () => {
      ignore = true
    }
  }, [open])

  const close = () => {
    setSelected(null)
    setQuery("")
    onClose()
  }

  const choose = (url: string) => {
    onSelect(url)
    close()
  }

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Chỉ chấp nhận file ảnh")
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024)
      return toast.error(`Ảnh vượt quá ${MAX_UPLOAD_MB}MB`)
    setUploading(true)
    try {
      choose(await adminUpload(file))
      toast.success("Đã tải ảnh lên thư viện")
    } catch {
      toast.error("Không thể tải ảnh lên")
    } finally {
      setUploading(false)
    }
  }

  const visible = (items ?? []).filter((m) =>
    m.fileName.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Modal
      title={title}
      open={open}
      onCancel={close}
      width={880}
      okText="Dùng ảnh này"
      cancelText="Đóng"
      okButtonProps={{ disabled: !selected, className: "!bg-[#059669]" }}
      onOk={() => selected && choose(selected)}
      destroyOnHidden
    >
      <div className="mt-3 flex items-center gap-3">
        <Input.Search
          allowClear
          placeholder="Tìm theo tên file"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            void handleUpload(file)
            return Upload.LIST_IGNORE
          }}
        >
          <Button icon={<UploadOutlined />} loading={uploading}>
            Tải ảnh mới
          </Button>
        </Upload>
      </div>

      <div className="mt-4 max-h-[60vh] min-h-[240px] overflow-y-auto">
        {items === null ? (
          <div className="flex h-[240px] items-center justify-center">
            <Spin />
          </div>
        ) : visible.length === 0 ? (
          <Empty
            className="py-12"
            description={items.length === 0 ? "Thư viện chưa có ảnh nào" : "Không có ảnh khớp"}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visible.map((m) => {
              const url = resolveMediaUrl(m.url)
              return (
                <button
                  key={m.id}
                  type="button"
                  title={m.fileName}
                  onClick={() => setSelected(url)}
                  onDoubleClick={() => choose(url)}
                  className={cn(
                    "group overflow-hidden rounded-lg text-left outline-offset-2 transition",
                    selected === url ? "outline-2 outline-[#059669]" : "hover:opacity-90"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails from the backend */}
                  <img
                    src={url}
                    alt={m.fileName}
                    loading="lazy"
                    className="aspect-[4/3] w-full bg-[#f5f5f5] object-cover"
                  />
                  <p className="truncate px-1 pt-1.5 text-[11px] text-[#8c8c8c]">{m.fileName}</p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}

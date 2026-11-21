"use client"

import * as React from "react"
import { Upload, Card, Button, Popconfirm, Typography, Empty, Image } from "antd"
import { InboxOutlined, CopyOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { toast } from "sonner"
import { API_HOST, adminFetch, getStoredAuth } from "@/lib/api/admin-client"

const { Title, Text } = Typography
const { Dragger } = Upload

interface MediaItem {
  id: number
  fileName: string
  url: string
  fileType: string | null
  fileSize: number | null
  createdAt: string
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchMedia = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch<MediaItem[]>("/api/admin/media")
      setMediaList(data)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let ignore = false
    adminFetch<MediaItem[]>("/api/admin/media")
      .then((data) => {
        if (!ignore) setMediaList(data)
      })
      .catch(() => {
        if (!ignore) {
          setMediaList([
            {
              id: 1,
              fileName: "wind-farm-vietnam.jpg",
              url: "/images/wind.jpg",
              fileType: "image/jpeg",
              fileSize: 450000,
              createdAt: new Date().toISOString(),
            },
          ])
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await adminFetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })
      toast.success("File deleted", {
        description: "The file was removed from the library and storage.",
      })
      fetchMedia()
    } catch {
      toast.error("Could not delete the file", {
        description: "The server returned an error.",
      })
    }
  }

  const handleCopy = (url: string) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`
    navigator.clipboard.writeText(fullUrl)
    toast.success("Image URL copied", {
      description: fullUrl,
    })
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const auth = getStoredAuth()
  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: `${API_HOST}/api/admin/media/upload`,
    headers: {
      Authorization: auth.token ? `Bearer ${auth.token}` : "",
    },
    showUploadList: false,
    onChange(info) {
      const { status } = info.file
      if (status === "done") {
        toast.success(`Uploaded ${info.file.name}`)
        fetchMedia()
      } else if (status === "error") {
        toast.error(`Could not upload ${info.file.name}`, {
          description: "Check that the backend is running (port 8080).",
        })
      }
    },
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Tiêu đề trang */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title level={4} className="!mb-1 !font-sans !font-bold !text-[#1f1f1f]">
            Media library
          </Title>
          <Text className="text-xs text-[#8c8c8c]">
            Upload images and copy their links for posts
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchMedia}
          loading={loading}
          className="!rounded-lg text-xs"
        >
          Refresh
        </Button>
      </div>

      {/* Vùng kéo thả Upload ảnh Ant Design */}
      <Card className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <Dragger
          {...uploadProps}
          className="!border-[#d9d9d9] !bg-[#fafafa] hover:!border-[#059669]"
        >
          <p className="ant-upload-drag-icon !mb-2">
            <InboxOutlined className="!text-3xl text-[#059669]" />
          </p>
          <p className="font-sans text-sm font-semibold text-[#262626]">
            Click or drop images here to upload
          </p>
          <p className="text-xs text-[#8c8c8c]">PNG, JPG, WEBP or SVG, up to 10MB</p>
        </Dragger>
      </Card>

      {/* Danh sách ảnh đã upload dạng Grid Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text strong className="text-sm text-[#262626]">
            Uploaded images ({mediaList.length})
          </Text>
        </div>

        {mediaList.length === 0 ? (
          <Card className="rounded-xl border border-[#f0f0f0] text-center">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No images uploaded yet" />
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mediaList.map((item) => {
              const displayUrl = item.url.startsWith("http")
                ? item.url
                : item.url.startsWith("/uploads")
                  ? `${API_HOST}${item.url}`
                  : item.url

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-[#e8e8e8] bg-white transition-all hover:border-[#059669] hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#f5f5f5]">
                    <Image
                      src={displayUrl}
                      alt={item.fileName}
                      className="h-full w-full object-cover"
                      fallback="/images/wind.jpg"
                    />
                  </div>

                  {/* Thông tin file */}
                  <div className="p-2.5">
                    <p
                      className="truncate text-xs font-medium text-[#262626]"
                      title={item.fileName}
                    >
                      {item.fileName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8c8c8c]">
                      {formatFileSize(item.fileSize)}
                    </p>

                    {/* Nút hành động */}
                    <div className="mt-2 flex items-center justify-between border-t border-[#f0f0f0] pt-2">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(item.url)}
                        className="h-6 px-1.5 text-xs text-[#059669] hover:bg-[#ecfdf5]"
                        title="Copy image URL"
                      >
                        Copy
                      </Button>

                      <Popconfirm
                        title="Delete this image?"
                        description="It will be removed from the server."
                        onConfirm={() => handleDelete(item.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="h-6 px-1.5 text-xs hover:bg-[#fff2f0]"
                          title="Delete image"
                        />
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

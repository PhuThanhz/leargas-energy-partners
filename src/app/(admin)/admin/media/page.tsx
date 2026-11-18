"use client"

import * as React from "react"
import { Upload, Card, Button, Popconfirm, Typography, Empty, Image } from "antd"
import { InboxOutlined, CopyOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { toast } from "sonner"
import { adminFetch, getStoredAuth } from "@/lib/api/admin-client"

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
      toast.success("Đã xóa tệp tin", {
        description: "Tệp tin đã được gỡ khỏi thư viện và hệ thống lưu trữ.",
      })
      fetchMedia()
    } catch {
      toast.error("Không thể xóa tệp", {
        description: "Có lỗi xảy ra khi gửi yêu cầu lên máy chủ.",
      })
    }
  }

  const handleCopy = (url: string) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`
    navigator.clipboard.writeText(fullUrl)
    toast.success("Đã sao chép đường dẫn ảnh!", {
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
    action: "http://localhost:8080/api/admin/media/upload",
    headers: {
      Authorization: auth.token ? `Bearer ${auth.token}` : "",
    },
    showUploadList: false,
    onChange(info) {
      const { status } = info.file
      if (status === "done") {
        toast.success(`Tải lên thành công: ${info.file.name}`)
        fetchMedia()
      } else if (status === "error") {
        toast.error(`Không thể tải lên file: ${info.file.name}`, {
          description: "Vui lòng kiểm tra lại dịch vụ Backend cổng 8080.",
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
            Thư viện Hình ảnh & Tệp tin
          </Title>
          <Text className="text-xs text-[#8c8c8c]">
            Tải lên, quản lý và lấy đường dẫn hình ảnh cho bài viết và tư liệu dự án
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchMedia}
          loading={loading}
          className="!rounded-lg text-xs"
        >
          Làm mới
        </Button>
      </div>

      {/* Vùng kéo thả Upload ảnh Ant Design */}
      <Card className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <Dragger
          {...uploadProps}
          className="!border-[#d9d9d9] !bg-[#fafafa] hover:!border-[#1677ff]"
        >
          <p className="ant-upload-drag-icon !mb-2">
            <InboxOutlined className="!text-3xl text-[#1677ff]" />
          </p>
          <p className="font-sans text-sm font-semibold text-[#262626]">
            Nhấp hoặc Kéo thả ảnh vào khu vực này để tải lên
          </p>
          <p className="text-xs text-[#8c8c8c]">
            Hỗ trợ định dạng PNG, JPG, JPEG, WEBP, SVG dung lượng tối đa 10MB
          </p>
        </Dragger>
      </Card>

      {/* Danh sách ảnh đã upload dạng Grid Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text strong className="text-sm text-[#262626]">
            Ảnh đã tải lên ({mediaList.length})
          </Text>
        </div>

        {mediaList.length === 0 ? (
          <Card className="rounded-xl border border-[#f0f0f0] text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có hình ảnh nào được tải lên"
            />
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mediaList.map((item) => {
              const displayUrl = item.url.startsWith("http")
                ? item.url
                : item.url.startsWith("/uploads")
                  ? `http://localhost:8080${item.url}`
                  : item.url

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-[#e8e8e8] bg-white transition-all hover:border-[#1677ff] hover:shadow-md"
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
                        className="h-6 px-1.5 text-xs text-[#1677ff] hover:bg-[#e6f4ff]"
                        title="Sao chép Link ảnh"
                      >
                        Copy
                      </Button>

                      <Popconfirm
                        title="Xóa ảnh này?"
                        description="Ảnh sẽ bị xóa khỏi máy chủ."
                        onConfirm={() => handleDelete(item.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="h-6 px-1.5 text-xs hover:bg-[#fff2f0]"
                          title="Xóa ảnh"
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

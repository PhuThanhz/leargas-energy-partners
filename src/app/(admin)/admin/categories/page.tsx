"use client"

import * as React from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Tag,
  Space,
  Popconfirm,
  Card,
  Typography,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import { toast } from "sonner"
import { adminFetch } from "@/lib/api/admin-client"

const { Title, Text } = Typography

interface CategoryItem {
  id: number
  name: string
  slug: string
  description: string | null
  color: string
  displayOrder: number
  postCount: number
  createdAt: string
}

const COLOR_PRESETS = [
  "#1677ff", // Blue
  "#52c41a", // Green
  "#722ed1", // Purple
  "#fa8c16", // Orange
  "#13c2c2", // Teal
  "#eb2f96", // Magenta
  "#faad14", // Amber
  "#f5222d", // Red
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [modalVisible, setModalVisible] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [form] = Form.useForm()

  const fetchCategories = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch<CategoryItem[]>("/api/admin/categories")
      setCategories(data)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let ignore = false
    adminFetch<CategoryItem[]>("/api/admin/categories")
      .then((data) => {
        if (!ignore) setCategories(data)
      })
      .catch(() => {
        if (!ignore) {
          setCategories([
            {
              id: 1,
              name: "Góc nhìn Đầu tư",
              slug: "investment-insights",
              description:
                "Phân tích vĩ mô, chiến lược thoái vốn và sinh lời dự án năng lượng tái tạo",
              color: "#1677ff",
              displayOrder: 1,
              postCount: 1,
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              name: "M&A & Hợp tác Chiến lược",
              slug: "ma-strategic-partnership",
              description: "Thẩm định kỹ thuật, cơ cấu giao dịch M&A và kết nối dòng vốn quốc tế",
              color: "#52c41a",
              displayOrder: 2,
              postCount: 1,
              createdAt: new Date().toISOString(),
            },
            {
              id: 3,
              name: "Pháp lý & Quy hoạch PDP8",
              slug: "legal-pdp8",
              description:
                "Cập nhật quy chế đầu tư, phê duyệt lưới điện và chính sách giá mua điện FIT/DPPA",
              color: "#722ed1",
              displayOrder: 3,
              postCount: 1,
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

  const handleOpenCreateModal = () => {
    setEditingCategory(null)
    form.resetFields()
    form.setFieldsValue({
      color: "#1677ff",
      displayOrder: categories.length + 1,
    })
    setModalVisible(true)
  }

  const handleOpenEditModal = (record: CategoryItem) => {
    setEditingCategory(record)
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      description: record.description,
      color: record.color || "#1677ff",
      displayOrder: record.displayOrder,
    })
    setModalVisible(true)
  }

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!editingCategory) {
      form.setFieldsValue({ slug: autoSlug(val) })
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      if (editingCategory) {
        await adminFetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        })
        toast.success("Cập nhật chuyên mục thành công", {
          description: `Chuyên mục "${values.name}" đã được cập nhật.`,
        })
      } else {
        await adminFetch("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(values),
        })
        toast.success("Tạo chuyên mục mới thành công", {
          description: `Đã thêm chuyên mục "${values.name}" vào hệ thống.`,
        })
      }

      setModalVisible(false)
      fetchCategories()
    } catch {
      toast.error("Không thể lưu chuyên mục", {
        description: "Vui lòng kiểm tra lại kết nối và thử lại.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    try {
      await adminFetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })
      toast.success("Đã xóa chuyên mục", {
        description: `Đã xóa chuyên mục "${name}" khỏi cơ sở dữ liệu.`,
      })
      fetchCategories()
    } catch {
      toast.error("Không thể xóa chuyên mục", {
        description: "Có lỗi xảy ra khi gửi yêu cầu lên máy chủ.",
      })
    }
  }

  const columns = [
    {
      title: "Chuyên mục",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: CategoryItem) => (
        <Space orientation="vertical" size={2}>
          <div className="flexorientation items-center gap-2">
            <Tag
              color={record.color || "#1677ff"}
              className="rounded-full px-2.5 py-0.5 font-medium"
            >
              {text}
            </Tag>
          </div>
          {record.description && (
            <Text type="secondary" className="text-xs">
              {record.description}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Slug URL",
      dataIndex: "slug",
      key: "slug",
      render: (slug: string) => (
        <span className="rounded bg-[#f5f5f5] px-2 py-1 font-mono text-xs text-[#595959]">
          {slug}
        </span>
      ),
    },
    {
      title: "Số bài viết",
      dataIndex: "postCount",
      key: "postCount",
      width: 120,
      align: "center" as const,
      render: (count: number) => (
        <span className="inline-block rounded-full bg-[#f0f2f5] px-2.5 py-0.5 text-xs font-semibold text-[#262626]">
          {count || 0} bài
        </span>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "displayOrder",
      key: "displayOrder",
      width: 90,
      align: "center" as const,
      render: (order: number) => <span className="text-xs text-[#8c8c8c]">#{order}</span>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      align: "right" as const,
      render: (_: unknown, record: CategoryItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEditModal(record)}
            className="text-[#1677ff] hover:bg-[#e6f4ff]"
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xác nhận xóa chuyên mục?"
            description={`Bạn có chắc muốn xóa chuyên mục "${record.name}"?`}
            onConfirm={() => handleDelete(record.id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              className="hover:bg-[#fff2f0]"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang chuẩn Ant Design Pro */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title level={4} className="!mb-1 !font-sans !font-bold !text-[#1f1f1f]">
            Quản lý Chuyên mục (Taxonomy)
          </Title>
          <Text className="text-xs text-[#8c8c8c]">
            Khai báo, phân loại và tổ chức danh mục bài phân tích đầu tư & năng lượng tái tạo
          </Text>
        </div>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchCategories}
            loading={loading}
            className="!rounded-lg text-xs"
          >
            Làm mới
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
            className="!rounded-lg !bg-[#1677ff] text-xs font-medium shadow-sm hover:!bg-[#4096ff]"
          >
            Thêm chuyên mục mới
          </Button>
        </Space>
      </div>

      {/* Bảng dữ liệu Chuyên mục Ant Design */}
      <Card className="rounded-xl border border-[#f0f0f0] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="font-sans"
        />
      </Card>

      {/* Modal Thêm / Chỉnh sửa Chuyên mục */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FolderOutlined className="text-[#1677ff]" />
            <span>{editingCategory ? "Chỉnh sửa Chuyên mục" : "Khai báo Chuyên mục Mới"}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editingCategory ? "Lưu thay đổi" : "Tạo chuyên mục"}
        cancelText="Hủy bỏ"
        okButtonProps={{ className: "!bg-[#1677ff]" }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4 font-sans">
          <Form.Item
            name="name"
            label="Tên chuyên mục"
            rules={[{ required: true, message: "Vui lòng nhập tên chuyên mục!" }]}
          >
            <Input
              placeholder="VD: Góc nhìn Đầu tư, M&A & Hợp tác Chiến lược..."
              onChange={handleNameChange}
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Đường dẫn tĩnh (Slug URL)"
            rules={[{ required: true, message: "Vui lòng nhập slug URL!" }]}
            help="Được dùng trong URL bộ lọc, ví dụ: /blog?category=investment-insights"
          >
            <Input placeholder="investment-insights" className="rounded-md font-mono text-xs" />
          </Form.Item>

          <Form.Item name="color" label="Màu sắc nhận diện (Tag Color)">
            <div>
              <Input
                placeholder="#1677ff"
                className="mb-2 w-36 rounded-md font-mono text-xs"
                prefix={
                  <div
                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: form.getFieldValue("color") || "#1677ff" }}
                  />
                }
              />
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <div
                    key={c}
                    onClick={() => form.setFieldsValue({ color: c })}
                    style={{ backgroundColor: c }}
                    className="orientation h-6 w-6 cursor-pointer rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 active:scale-95"
                    title={c}
                  />
                ))}
              </div>
            </div>
          </Form.Item>

          <Form.Item name="displayOrder" label="Thứ tự hiển thị">
            <InputNumber min={0} max={999} className="w-32 rounded-md" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chuyên mục">
            <Input.TextArea
              rows={3}
              placeholder="Tóm tắt định hướng và phạm vi các bài viết thuộc chuyên mục này..."
              className="rounded-md text-xs"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

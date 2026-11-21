"use client"

import { adminFetch } from "@/lib/api/admin-client"
import {
  PostEditorForm,
  type PostDetail,
  type PostPayload,
} from "@/components/admin/post-editor-form"

export default function NewPostPage() {
  const createPost = (payload: PostPayload) =>
    adminFetch<PostDetail>("/api/admin/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    })

  return <PostEditorForm onSave={createPost} />
}

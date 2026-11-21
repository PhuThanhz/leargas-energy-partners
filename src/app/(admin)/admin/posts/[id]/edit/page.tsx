"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button, Result, Spin } from "antd"

import { adminFetch } from "@/lib/api/admin-client"
import {
  PostEditorForm,
  type PostDetail,
  type PostPayload,
} from "@/components/admin/post-editor-form"

type LoadState =
  { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; post: PostDetail }

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const [state, setState] = React.useState<LoadState>({ kind: "loading" })
  const [attempt, setAttempt] = React.useState(0)

  React.useEffect(() => {
    let ignore = false
    adminFetch<PostDetail>(`/api/admin/posts/${id}`)
      .then((post) => {
        if (!ignore) setState({ kind: "ready", post })
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setState({
            kind: "error",
            message: error instanceof Error ? error.message : "Could not load the post",
          })
        }
      })
    return () => {
      ignore = true
    }
  }, [id, attempt])

  const updatePost = (payload: PostPayload) =>
    adminFetch<PostDetail>(`/api/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })

  if (state.kind === "loading") {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (state.kind === "error") {
    return (
      <Result
        status="warning"
        title="Could not load the post"
        subTitle={state.message}
        extra={[
          <Button
            key="retry"
            type="primary"
            className="!bg-[#059669]"
            onClick={() => {
              setState({ kind: "loading" })
              setAttempt((n) => n + 1)
            }}
          >
            Try again
          </Button>,
          <Link key="back" href="/admin/posts">
            <Button>Back to posts</Button>
          </Link>,
        ]}
      />
    )
  }

  return <PostEditorForm key={state.post.id} initial={state.post} onSave={updatePost} />
}

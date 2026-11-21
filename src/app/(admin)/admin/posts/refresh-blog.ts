import { refreshBlog } from "./actions"

/**
 * Call the refreshBlog server action without letting it block the UI.
 * Resolves `true` once the public cache is refreshed, `false` on error or after `ms`
 * (e.g. a tab still running an old build after the dev server restarted).
 */
export function refreshBlogSafely(slugs: (string | undefined)[], ms = 4000): Promise<boolean> {
  return Promise.race([
    refreshBlog(...slugs).then(
      () => true,
      () => false
    ),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), ms)),
  ])
}

import { useEffect } from 'react'

/**
 * Sets document.title and meta description dynamically per page.
 * No external library needed — works with modern crawlers (Google executes JS).
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}

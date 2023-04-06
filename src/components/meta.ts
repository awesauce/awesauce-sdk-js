import { thumbUrlForPost } from '../lib/utils.js'
import type { Post } from '../lib/models.js'

/**
 * Builds common meta tags for Post model.
 * @param post model contains title, description
 * @param site application/site name
 * @param url url of this page
 * @returns string for rendering meta tags
 */
export function MetaFromPost(post: Post, site: string, url: string): string {
  return Meta(site, url, post.title, post.excerpt, thumbUrlForPost(post))
}

/**
 * Builds common meta tags.
 * @param site application/site name
 * @param url url of this page
 * @param title title of page
 * @param description short description of page
 * @param image image to go with page
 * @returns String for rendering meta tags
 */
export function Meta(site: string, url: string, title: string, description?: string, image?: string): string {
  var tags: string = `
  <meta name="application-name" content="${site}" />
  <meta name="description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="${site}" />
  <meta property="og:title" content="${title}" />
  `
  if (description != undefined) {
    tags += `<meta property="og:description" content="${description}" />
  `
  }
  if (image != undefined) {
    tags += `<meta property="og:image" content="${image}" />
  `
  }
  return tags
}
import { thumbUrlForPost, findAssetUrlForUse } from '../lib/utils.js'
import type { Post, Author } from '../lib/models.js'

/**
 * Creates structured LD+JSON for Post, fitting https://schema.org
 * @param post to create structured data from
 * @returns string of script tag containing ld+json
 */
export function StructuredDataForPost(post: Post): string {
  var object: any
  switch (post.type) {
    case 'app':
      object = appFromPost(post)
    break
    default:
      object = articleFromPost(post)
  }
  return `<script type="application/ld+json">${JSON.stringify(object)}</script>`
}


// https://schema.org/Article
function articleFromPost(post: Post): any {
  let author: any = personFromAuthor(post.author)
  let image: string | undefined = thumbUrlForPost(post)
  return {
    "@context": "http://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(author && {'author': author}),
    description: post.excerpt,
    datePublished: post.created,
    dateModified: post.edited,
    ...(image && {'image': image})
  }
}

// https://schema.org/MobileApplication
function appFromPost(post: Post): any {
  let image: string | undefined = thumbUrlForPost(post)
  let screenshot: string | undefined = findAssetUrlForUse('screen', post.images)
  return {
    "@context": "https://schema.org",
    "@type": typesFromAppPost(post),
    name: post.title,
    description: post.excerpt,
    operatingSystem: operatingSystemsFromAppPost(post),
    applicationCategory: categoriesFromAppPost(post),
    ...(image && {'image': image}),
    ...(image && {'thumbnailUrl': image}),
    ...(screenshot && {'screenshot': screenshot}),
    downloadUrl: linksFromAppPost(post)
  }
}

// https://schema.org/Person
function personFromAuthor(author: Author): any {
  if (author == undefined) { return undefined }
  return {
    "@type": "Person",
    name: author.name,
    ...(author.email && {'email': author.email})
  }
}

// https://developers.google.com/search/docs/appearance/structured-data/software-app
function typesFromAppPost(post: Post): string[] {
  var types: string[] = [ 'MobileApplication', 'SoftwareApplication' ]
  if (post.categories?.some(c => c.toLowerCase() == 'game')) {
    types.push('VideoGame')
  }
  return types
}

// https://developers.google.com/search/docs/appearance/structured-data/software-app
function categoriesFromAppPost(post: Post): string[] {
  if (post.categories == undefined) { return undefined }
  return post.categories.map(c => {
    switch (c.toLowerCase()) {
      case 'game': return 'GameApplication'
      case 'trivia': return 'Trivia'
      case 'utilities': return 'UtilitiesApplication'
      case 'photo': return 'PhotoApplication'
      case 'toy': return 'Toy'
      case 'health': return 'HealthApplication'
      case 'entertainment': return 'EntertainmentApplication'
      case 'reference': return 'ReferenceApplication'
      case 'sports': return 'SportsApplication'
      case 'shopping': return 'ShoppingApplication'
    }
    return c
  })
}

function operatingSystemsFromAppPost(post: Post): string[] {
  var os: string[] = []
  if (post.links?.iosAppStore != undefined) { os.push('iOS') }
  if (post.links?.macAppStore != undefined) { os.push('OS X') }
  if (post.links?.googlePlay != undefined) { os.push('ANDROID') }
  if (post.links?.amazonAppStore != undefined) { os.push('AMAZON') }
  return os
}

function linksFromAppPost(post: Post): string[] {
  var links: string[] = []
  if (post.links?.iosAppStore != undefined) { links.push(post.links.iosAppStore) }
  if (post.links?.macAppStore != undefined) { links.push(post.links.macAppStore) }
  if (post.links?.googlePlay != undefined) { links.push(post.links.googlePlay) }
  if (post.links?.amazonAppStore != undefined) { links.push(post.links.amazonAppStore) }
  return links
}

/*
 *  .^^. <|     <|  .^.  .^^.| .^^.  <|  <|  .^^.  .^.
 *  ` __| |      | |___| '_    ` __|  |   | |   ` |___|
 *  .`  | |  /\  | |        '. .`  |  |   | |     |
 *  '._.|> \/  \/  '._.' |._.' '._.|> '._.|>'._.' '._.'
 *
 *    Coded by Tim, Sept. 2021
 */

/* export type Link = {
  icon?: string,
  label?: string,
  url: string
} */

export type PostLinks = {
  iosAppStore?: string,
  macAppStore?: string,
  googlePlay?: string,
  amazonAppStore?: string
  gameCrafter?: string
}

export type PostSale = {
  sku?: string,
  price?: number,
  currency?: string,
  quantity?: number,
  weight?: number,
  dimensions?: {l: number, w: number, h: number }
}

export type Post = {
  title: string,
  slug: string,
  excerpt: string,
  author?: Author,
  created: any,
  
  edited?: any,
  categories?: string[],
  contentType?: string,
  content?: string,

  sale?: PostSale,

  thumbnail?: Asset,
  image?: Asset,
  images?: Asset[],
  type?: string,
  links?: PostLinks,
  embeds?: OEmbed[]
}

export type Author = {
  name: string,
  email?: string,
  bio?: string
}

export type Color = {
  name: string,
  hex: string,
  use: string
}

export type Font = {
  name: string,
  sizes: string,
  source: string,
  stack: string,
  use: string
}

export type Asset = {
  use?: string,
  mediaType?: string,
  data?: string,
  url?: string
}

export type Content = {
  homeType?: string,
  homeSlug?: string,
  copyright?: string
}

export type PostType = {
  path: string,
  name?: string,
  categories?: string[]
}

export type Brand = {
  name: string,
  slug: string,
  colors: Color[],
  fonts: Font[],
  tagline?: string,
  postTypes?: PostType[],
  content?: Content,
  site?: string,
  tenant?: string,

  hasLogomark?: boolean,
  hasLogotype?: boolean
}

export type Site = {
  brand: Brand,
  assets: Asset[],
  cssVariables?: string
}

// Update brand in site model to know if had certain assets
export function brandHasAssets(site: Site) {
  if (!site) { return }
  for (let i = 0; i < site.assets.length; i++) {
    if (site.assets[i].use === 'logomark') {
      site.brand.hasLogomark = true
    } else if (site.assets[i].use === 'logotype') {
      site.brand.hasLogotype = true
    }
  }
}


export type Feedback = {
  email: string,
  message: string,
  brand?: string,
  hostname: string,
  postType?: string,
  post?: string,
  postTitle?: string,
  userAgent: string
}

/*
 MISS logomark
 svg text len: 345
 base64   len: 460

 MISS logotype
 svg text len: 3168
base64   len: 4224

APL logomark
svg text len: 422
base64   len: 564

APL logotype
svg text len: 1006
base64   len: 1344


      console.log(`svg text len: ${a.data.length}`)
      console.log(`base64   len: ${base64s.logomark.length}`)

  console.log('------')
  console.log(base64s)
  console.log('------')
*/

// oEmbed response, https://oembed.com/
export type OEmbed = {
  embed: string, // original url

  type?: string, // required, "rich", "video", "link", "photo"
  version?: string,

  title?: string,
  author_name?: string,
  author_url?: string,
  provider_name?: string,
  provider_url?: string,
  cache_age?: number,
  thumbnail_url?: string,
  thumbnail_width?: number,
  thumbnail_height?: number,

  url?: string, // "photo" src for <img>
  html?: string, // html embed code for "video", or html with padding/margin for "rich" 
  height?: number,
  width?: number,
}
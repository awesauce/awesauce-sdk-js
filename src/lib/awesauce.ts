
import type { Brand, Site, Post, Feedback } from './models.js'
import { brandHasAssets } from './models.js'
import { queryStringFrom } from './utils.js'

const DEFAULT_API = "https://data.mongodb-api.com/app/awesauce-cms-aesdg/endpoint/cms"
const DEFAULT_HOST = "apellean.com"

type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export type AwesauceConfig = {
  api?: string,
  host?: string,
  brand?: string,
  tenant?: string,
  fetch?: Fetch
}

export class Awesauce {
  /// Stores config. Tenant may be set by the brand returned with site call
  private static config: AwesauceConfig = {
    api: DEFAULT_API,
    host: DEFAULT_HOST,
    /// SvelteKit SSR load() function has a special hydrating fetch() we should use
    /// but by default set to use regular fetch.
    fetch: (typeof window !== 'undefined') ? window.fetch : undefined
  }

  /**
   * Set particular config settings
   * @param config new config values, adds/overwrite but does not replace
   */
  static setConfig(config: AwesauceConfig) {
    Awesauce.config = {...Awesauce.config, ...config}
  }

  /**
   * Fetches Site, which includes brand and main logo assets.
   * If brand has a tenant it will be saved to config for future calls.
   * @param config new config values, adds/overwrite but does not replace
   * @returns Site object, or a default Not Found one.
   */
  static async fetchSite(config: AwesauceConfig): Promise<Site | null> {
    Awesauce.config = {...Awesauce.config, ...config}

    // use brand if set, otherwise host
    const endpoint = Awesauce.config.brand !== undefined ?
          `${Awesauce.config.api}/site?brand=${Awesauce.config.host}` :
          `${Awesauce.config.api}/site?host=${Awesauce.config.host}`

    const res = await Awesauce.config.fetch(endpoint)
    if (!res.ok) { return null}
  
    var site: Site = await res.json()
    if (site === null) { // not working?
      return {
        brand: {
          name: 'Not Found',
          slug: 'notfound',
          colors: [],
          fonts: []
        },
        assets: []
      }
    } else {
      brandHasAssets(site)
      Awesauce.config.tenant = site.brand.tenant
    }

    return site
  }

  /**
   * Returns array of posts
   * @param postType posts may be grouped by type
   * @param category optional category for posts
   * @param limit max posts returned, if no category defaults to 20
   * @param skip for paging
   * @returns Array of posts, I promise
   */
  static async fetchPosts(postType?: string, category?: string, limit?: number, skip?: number): Promise<Post[]> {
    // posts
    // host, brand, category, tenant

    if (category === undefined && limit === undefined) {
      limit = 20
    }
    const params: any = {
      ...(Awesauce.config.host && {'host': Awesauce.config.host}),
      ...(Awesauce.config.brand && {'brand': Awesauce.config.brand}),
      ...(Awesauce.config.tenant && {'tenant': Awesauce.config.tenant}),
      ...(postType && {'type': postType}),
      ...(category && {'category': category}),
      ...(limit && {'limit': limit}),
      ...(skip && {'skip': skip})
    }

    const endpoint = `${Awesauce.config.api}/posts?${queryStringFrom(params)}`
    const res = await Awesauce.config.fetch(endpoint)

    if (res.ok) {
      return await res.json()
    }
    return []
  }

  /**
   * Fetches a single post by slug for current host
   * @param slug required post slug
   * @param postType optional, if multiple post types could have similar slugs?
   * @returns The post or null if not found, I promise
   */
  static async fetchPost(slug: string, postType?: string): Promise<Post | null> {
    const params: any = {
      slug,
      ...(postType && {'type': postType}),
      ...(Awesauce.config.host && {'host': Awesauce.config.host}),
      ...(Awesauce.config.brand && {'brand': Awesauce.config.brand}),
      ...(Awesauce.config.tenant && {'tenant': Awesauce.config.tenant})
    }
    const endpoint = `${Awesauce.config.api}/post?${queryStringFrom(params)}`
    const res = await Awesauce.config.fetch(endpoint)
    if (res.ok) {
      return await res.json()
    }
    return null
  }

  /**
   * Submit Feedback. Posts to tenant if set in config.
   * @param payload Feedback payload, contains most info
   * @returns Fetch Response (ie. check res.status === 200), I promise
   */
  static async postFeedback(payload: Feedback): Promise<Response> {
    const params: any = {
      secret: 'afterthought',
      ...(Awesauce.config.tenant && {'tenant': Awesauce.config.tenant})
    }
    const endpoint = `${Awesauce.config.api}/feedback?${queryStringFrom(params)}`
    return Awesauce.config.fetch(endpoint, {method: 'POST', body: JSON.stringify(payload)})
  }
}


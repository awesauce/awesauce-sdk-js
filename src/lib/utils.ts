
import type { Brand, Asset, Post } from './models.js'


//import { BROWSER } from 'esm-env'
//declare const Buffer: any
//export const base64 = BROWSER ? (d: string) => btoa(d) :
//  (d: string) => Buffer.from(d, 'binary').toString('base64')

export const cssVariablesFrom = (brand: Brand) => {
  const font = brand.fonts[0]
  var cssVariables: string = `--font-stack: ${font.stack};`
  for (const color of brand.colors) {
    cssVariables += ` --color-${color.use}: ${color.hex};`
  }
  return cssVariables
}

export const queryStringFrom = (params: any) =>
      Object.keys(params).map(k => k + '=' + params[k]).join('&')


/// @return asset url for .image, or thumb, ir first images
export const thumbUrlForPost = (post: Post) => {
  if (post.image != undefined) {
    return post.image?.url
  } else if (post.images != undefined) {
    return findAssetUrlForUse('thumb', post.images)
  }
  return undefined
}

/// @return asset url for given use, defaults to first if none found
export const findAssetUrlForUse = (use: string, assets: Asset[]) => {
  if (assets == undefined || assets.length === 0) { return undefined }
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].use === use) {
      return assets[i].url
    }
  }
  return assets[0].url
}
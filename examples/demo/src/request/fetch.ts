import qs from 'qs'
import { assignIn } from 'lodash'
import type { MethodKey, Param, Response, UrlKey } from './InterfaceTypes'

const baseUrl = import.meta.env.VITE_BASE_URL

interface PathParams {
  [key: string]: string | number | boolean
}

export type FetchOptions = Omit<RequestInit, 'body' | 'method'> & {
  type?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
  payloadType?: 'json' | 'text' | 'formData' | 'form-urlencoded'
}

const payloadMapping = {
  'json': 'application/json;charset=UTF-8',
  'text': 'text/plain;charset=UTF-8',
  'formData': 'multipart/form-data',
  'form-urlencoded': 'application/x-www-form-urlencoded',
}

// const error: { [key: string]: boolean } = {};

/**
 *
 * @param url 路径，直接从swagger上拷贝下来的路径，包括{id}这类的动态路径
 * @param method 请求类型
 * @param params FetchParams 请求参数，分为 path query body 分别对应 路径参数（类似/delete/{id}）、查询参数（类似/query？id=123）、body（post body参数，将会JSON.stringfiy为字符串）
 * @param options FetchOptions fetch 去除body、method的原生参数，增加 type 用于格式化掉用res.json()类型的功能。
 * @returns fetch
 */
export default function customFetch<U extends UrlKey, M extends MethodKey<U>>(
  url: U,
  method: M,
  params?: Param<U, M> | undefined,
  { type = 'json', payloadType = 'json', headers, ...restOptions }: FetchOptions = {},
): Promise<Response<U, M>> {
  const requestMethod = (method as string).toLowerCase()

  let { path, query, body } = (params || {}) as { path?: any, query?: any, body?: any }

  // 如果请求是 GET ，则将 body 和 query 合并
  if (method === 'get' && (query || body)) {
    query = Object.assign({}, query, body)
    body = undefined
  }

  const defaultHeaders = {
    'Content-Type': payloadMapping[payloadType],
  }

  // 将token加入进去
  let authHeaders
  // if (!noAuthUrl.includes(url)) {
  //   const { token, tokenHead } = useAuthToken().auth;
  //   if (!token) {
  //     router.replace('/login');
  //     throw new Error('请登录');
  //   }
  //   authHeaders = {
  //     Authorization: `${tokenHead}${token}`,
  //   };
  // }

  let iUrl = url as string

  if (path)
    iUrl = replaceUrl(iUrl, path)

  if (query)
    iUrl = replaceQuery(iUrl, query)

  let requestBody: any
  // 如果 method 为 GET 时，body 为 undefined，body 传 undefined
  if (body !== undefined && method !== 'get') {
    requestBody
      = payloadType === 'json'
        ? JSON.stringify(body)
        : payloadType === 'form-urlencoded'
          ? replaceQuery('', body).slice(1)
          : body
  }
  return fetch(`${baseUrl}${iUrl}`, {
    ...restOptions,
    method: requestMethod,
    body: requestBody,
    headers: Object.assign(defaultHeaders, headers, authHeaders),
  })
    .then(async (res) => {
      //  如果 type 错误，默认使用 json
      if (res.status === 200) {
        if (/application\/json/.test(res.headers.get('content-type') || ''))
          return res.json()

        return res[type] ? res[type]() : res.json()
      }
      else {
        throw new Error(
          JSON.stringify({ status: res.status, statusText: res.statusText, url: res.url }),
        )
      }
    })
    .catch((err) => {
      console.error('fetch Error', err)
      throw err
    })
}

function replaceUrl(url: string, paths: PathParams) {
  return url.replace(/\{(\w+)\}/g, (_, $2) => {
    return paths[$2] ? `${paths[$2]}` : `{${$2}}`
  })
}

function replaceQuery(url: string, query: object) {
  const [baseUrl, ...queryStrs] = url.split('?')
  const queryObj = assignIn(
    {},
    queryStrs.reduce((pre, next) => {
      return assignIn(pre, qs.parse(next || ''))
    }, {}),
    query,
  )

  return `${baseUrl}?${qs.stringify(queryObj, { encode: true, arrayFormat: 'comma' })}`
}

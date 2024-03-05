export type RequestMethodType = 'post' | 'get' | 'put' | 'delete'
export interface RequestPlayloadType {
  param: {
    /**
     * 查询请求参数 ?id=123&date=2024-10-25
     */
    query?: Record<string, unknown>
    /**
     * 路径上的参数，比如 '/lp-auth/user/{id}/{date}'
     */
    path?: Record<string, string | number>
    /**
     * body 参数，比如 JSON、FormData 等
     */
    body?: Record<string, unknown>
  }
  response: unknown
}

export type RequestType = Record<string, Record<RequestMethodType, RequestPlayloadType>>

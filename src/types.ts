export interface UserSingleOptions {
  /**
   * typescript 类型定义所在文件夹
   */
  dir: string

  /**
   * 请求基础路径
   *
   * 比如 /api 啥的
   *
   * 如果配置是一个列表 prefix 必须要不一样，不然前一个配置会被后一个配置给覆盖掉
   *
   * @example '/api'
   * @default ''
   */
  prefix?: string

  /**
   * 延迟响应时间
   *
   * @example [300, 500]
   * @default [0,0]
   *
   */
  delay?: [number, number]

  /**
   * 返回数据包裹，有些数据存在固定的返回数据，比如 { msg:string, code:number, data:  }
   *
   * 在写接口时，每次都要写包裹的内容，比较烦，这儿可以统一设置
   *
   * 当传入这个值时，需要有个属性的值为 @Interface 才能将生成的接口包裹住，否则不生效
   *
   * 其他属性值满足 Mockjs 的模板内容
   *
   * @example { 'msg': '@string', 'code|+1': [200, 404, 500], 'data': '@Interface' }
   * @default undefined
   */
  wrapper?: Record<string, any>
}

export type UserOptions = UserSingleOptions | UserSingleOptions[]

export interface ResolvedSingleOptions {
  root: string
  dir: string
  delay: [number, number]
  prefix: string
  wrapper?: Record<string, any>
  negativeRe: RegExp
}

export type ResolvedOptions = ResolvedSingleOptions[]

interface User {

  /**
   * @format ~string(7, 10)
   * @pattern 1
   */
  name: string

  /**
   * @format ~uuid
   */
  id: number
}

/**
 *
 * @format ~string(7, 11)
 * @pattern 1
 * @default 123
 * @description 123
 */
type Age = number

export default interface AdminApi {

  'admin/user': {
    /**
     * @description ~debug 可以打印生成的数据模板，以便查看有没有问题
     */
    get: {
      param: { query: { pageSize: number, page: number, name: string } }
      response: {
        /**
         *
         * @format ~string(7, 10)
         * @pattern 1
         * @description 1
         */
        ages: Age[]
        list: User[]
        total: number
        page: number
      }
    }
    post: {
      param: { body: { name: string } }
      response: User
    }
  }

}

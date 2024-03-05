export default interface JuHeAPI {
  /**
   * @description 获取头条新闻
   */
  '/toutiao/index': {
    /**
     * @description ~debug 打印获取的数据
     */
    get: {
      param: {
        query: {
          type: 'top' | 'guonei' | 'guoji' | 'yule' | 'tiyu'
          page: number
          page_size: number
          is_filter: 1 | 0
        }
      }
      response: {
        error_code: number
        reason: string
        result: {
          page: number
          pageSize: number
          stat: string
          data: {
            uniquekey: string
            title: string
            date: string
            category: string
            author_name: string
            url: string
            thumbnail_pic_s: string
            is_content: string
          }[]
        }
      }
    }
  }
  '/mobile/get': {
    get: {
      param: {
        query: {
          phone: number
          dtype?: string
        }
      }
      response: {
        error_code: number
        reason: string
        result: {

          province: string
          city: string
          areacode: string
          zip: string
          company: string
          card: string
        }
      }
    }
  }
  '/simpleWeather/query': {
    get: {
      param: {
        query: {
          city: string
        }
      }
      response: {
        error_code: number
        reason: string
        result: {
          city: string
          realtime: {
            temperature: string
            humidity: string
            info: string
            wid: string
            direct: string
            power: string
            aqi: string
          }
          future: {
            date: string
            temperature: string
            weather: string
            wid: {
              day: string
              night: string
            }
            direct: string
          }[]
        }
      }
    }
  }
}

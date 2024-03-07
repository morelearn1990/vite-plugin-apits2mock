# vite-plugin-apits2mock

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

apits2mock

在 vite 上对 openapi 生成的 apits 进行接口模拟

## 使用方式

[参考 demo](https://github.com/morelearn1990/vite-plugin-apits2mock/tree/main/examples/demo)

配合 [vite-plugin-swagger2ts](https://github.com/morelearn1990/vite-plugin-swagger2ts) 食用更佳

1、定义接口到指定文件夹

数据模拟使用 [mockjs](http://mockjs.com)，定义接口时可以通过注释对接口生成的模板进行处理。

| 注释类型 | 对应 mockjs | 说明 |
|-------|-------|-------|
| description | - | 注释带有 ~debug 会打印生成的 mock 模板，用以查看是否符合要求 |
| format | 数据占位符 | mockjs 的占位符,比如 ~name、 ~date 等，由于 mockjs 的数据模板有字符 `@` 与注释的 `@` 冲突了，需要将 数据模板的 `@` 换成 `~` |
| pattern | 生成规则 | 表示 mockjs 的生成规则,比如 +1 、10-20 等 |

[Mockjs](http://mockjs.com/examples.html#Text)
[语法介绍](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)

```ts
// request/interfaces/xxx.ts

export default interface JuHeInterface {
  '/toutiao/index': {
    /**
     * @description description 注释带有 ~debug 会打印生成的 mock 模板，用以查看是否符合要求
     */
    get: {
      // 请求参数，固定类型，可选
      // TODO 增加接口类型校验
      param: {
        query: {
          type: 'top' | 'guonei' | 'guoji' | 'yule' | 'tiyu'
          page: number
          page_size: number
          is_filter: 1 | 0
        }
      }
      // 请求返回内容，必选
      response: {
        /**
         * @description format 注释表示 mockjs 的占位符,比如 ~name、 ~date 等
         * @format ~integer(10)
         */
        page: number
        /**
         * @format ~integer(10)
         */
        pageSize: number
        /**
         * @description pattern 注释表示 mockjs 的生成规则,比如 +1 、10-20 等
         * @format ~name
         * @pattern 2
         */
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
```

2、配置插件

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import TS2Mock from 'vite-plugin-apits2mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    TS2Mock([{
      // 目标文件夹地址，里面能解析的 interface 都会变成模板
      dir: 'src/request/interfaces',
      // url 前缀，和开发代理服务器配合时，可以将代理报错的接口进行模拟
      prefix: '/api',
      // 接口统一包装，增加接口统一返回的包装格式，在定义接口时可以去掉这部分的类型定义
      wrapper: {
        error_code: '@integer(10,200)',
        reason: '@string',
        // 文件夹里定义的类型会被替换在这里
        result: '@Interface',
      },
    }]),
  ],
  resolve: {
    alias: { '@/': '/src/' },
  },
  server: {
    proxy: {
      // 和 TS2Mock 配置 prefix 一致时，会在修改代理配置 configure 函数，监听代理的事件进行处理数据模拟
      '/api': {
        target: 'https://apis.juhe.cn/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [Morelearn](https://github.com/morelearn1990)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-apits2mock?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vite-plugin-apits2mock
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-apits2mock?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-apits2mock
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vite-plugin-apits2mock?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vite-plugin-apits2mock
[license-src]: https://img.shields.io/github/license/morelearn1990/vite-plugin-apits2mock.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/morelearn1990/vite-plugin-apits2mock/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vite-plugin-apits2mock

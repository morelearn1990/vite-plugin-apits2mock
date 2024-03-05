import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ProxyOptions } from 'vite'
import type { ResolvedSingleOptions, UserOptions } from './types'
import { getTSFiles, isDir, isFile } from './files'
import { resolveOptions } from './utils'
import createSchemaFactory from './factory'

type OptionMapType = ResolvedSingleOptions & {
  mockFactory: ReturnType<typeof createSchemaFactory>
}

export default function ts2MockPlugin(options: UserOptions): Plugin {
  const resolvedOptions = resolveOptions(options)
  const optionMap = new Map<string, OptionMapType>()

  // 将数组的配置转换为 Map 以便后续使用
  resolvedOptions.forEach((resolvedOption) => {
    const mockFactory = createSchemaFactory(resolvedOption.wrapper)
    const prefixKey = `/${resolvedOption.prefix}/`.replace('//', '/')
    optionMap.set(prefixKey, { ...resolvedOption, mockFactory })
  })

  const apiMock = (req: IncomingMessage, res: ServerResponse, prefix?: string) => {
    // 是否能匹配上 path
    const pathname = new URL(req.url ?? '', `http://${req.headers.host}`).pathname

    if (!prefix)
      prefix = [...optionMap.keys()].find(key => pathname.startsWith(key))

    if (!prefix)
      return false
    const option = optionMap.get(prefix)
    if (!option)
      return false

    // 当能匹配上的时候，进行 mock
    const mockData = option.mockFactory.mock(pathname, req.method ?? 'GET')
    if (mockData) {
      res.end(JSON.stringify(mockData))
      return true
    }
    return false
  }

  // 生成所有配置的模拟文件
  const generateAllFile = async () => {
    [...optionMap.values()].map(async (item) => {
      try {
        // 开始生成所有的文件
        const preFiles = await getTSFiles(item)
        item.mockFactory.generateAll(preFiles)
      }
      catch (error) {
        console.error('generateAll', error)
      }
    })
  }
  // 文件发生变化是需要重新生成模拟文件
  const generateFile = async (file: string) => {
    [...optionMap.values()].forEach((item) => {
      isFile(file, item) && item.mockFactory.generate(file)
    })
  }
  // 文件被删除时，需要删除对应的模拟文件
  const removeFile = async (file: string) => {
    [...optionMap.values()].forEach((item) => {
      isFile(file, item) && item.mockFactory.remove(file)
    })
  }

  return {
    name: 'ts2mock',
    apply: 'serve',
    config(config) {
      const proxy = config.server?.proxy
      if (!proxy)
        return config

      // 对每个代理插入 configure 以便以 proxy 为优先
      // 对于能匹配上的代理路径, 将 mock 和测试服务集合起来
      // 先请求代理服务器获取数据,如果没有数据则使用 mock 模拟数据
      Object.keys(proxy).forEach((url) => {
        const proxyOptions = typeof proxy[url] === 'string'
          ? {
              target: proxy[url],
              changeOrigin: true,
            } as ProxyOptions
          : proxy[url] as ProxyOptions

        const dealUrl = `/${url}/`.replace('//', '/')

        const option = optionMap.get(dealUrl)
        if (option) {
          const userProxyConfigure = proxyOptions.configure
          proxyOptions.configure = (proxyServer, options) => {
            userProxyConfigure && userProxyConfigure(proxyServer, options)
            proxyServer.on('proxyRes', (proxyRes, req, res) => {
              if (proxyRes.statusCode === 404)
                apiMock(req, res, dealUrl)
            })

            proxyServer.on('error', (_err, req, res) => {
              apiMock(req, res, dealUrl)
            })
          }
        }

        proxy[url] = proxyOptions
      })

      return config
    },
    async configureServer(server) {
      const { watcher, middlewares } = server

      generateAllFile()

      watcher.on('add', generateFile)
      watcher.on('change', generateFile)
      watcher.on('unlink', removeFile)

      return () => middlewares.use((req, res, next) => {
        const isMocked = apiMock(req, res)
        if (!isMocked)
          next()
      })
    },
  }
}

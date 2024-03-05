import type { Schema } from 'ts-json-schema-generator'
import { pathToRegexp } from 'path-to-regexp'
import mockjs from 'mockjs'
import { slash } from './files'
import { getApis, parse } from './parse'
import { schema2MockTemp } from './mock'
import { mergeWrapper, parseWrapperInject } from './utils'

type CachedInfo = ReturnType<typeof getApis>[number] & {
  mockTemplate?: any
}

export default function createSchemaFactory(wrapper?: Record<string, any>) {
  const schemas = new Map<string, Schema>()
  const cachedAPIs = new Map<string, CachedInfo>()

  const remove = (file: string) => {
    file = slash(file);

    [...schemas.keys()].forEach((filePath) => {
      if (filePath !== file)
        return

      const rootSchema = schemas.get(filePath)
      const apis = getApis(rootSchema)

      for (const api of apis)
        cachedAPIs.delete(api.key)

      schemas.delete(filePath)
    })
  }

  const generate = async (file: string) => {
    file = slash(file)
    // 生成前先将之前的删除
    remove(file)

    const rootSchema = await parse(file)
    if (!rootSchema)
      return

    let wrapperInjectProps: (string | number)[] | undefined
    if (wrapper)
      wrapperInjectProps = parseWrapperInject(wrapper)

    const apis = getApis(rootSchema)
    for (const api of apis) {
      // 当定义为 boolean 时，忽略
      if (typeof api.response?.definition == 'boolean')
        continue

      let template = schema2MockTemp({ rootSchema: api.root, schema: api.response?.definition })
      if (/~debug/.test(api.definition.description ?? ''))
        console.log(`===============>\nrequest: ${api.key.replace('__', ' ')} \ntemplate:  `, JSON.stringify(template, null, 1))

      if (wrapperInjectProps && wrapper)
        template = mergeWrapper(wrapper, wrapperInjectProps, template)

      cachedAPIs.set(api.key, { ...api, mockTemplate: template })
    }

    schemas.set(file, rootSchema)
  }
  const generateAll = async (files: string[]) => {
    await Promise.all(files.map(file => generate(file)))
  }

  const mock = (url: string, method: string) => {
    const apiKeys = [...cachedAPIs.keys()]
    const reqKey = `${method.toLowerCase()}__${url}`

    const matched = apiKeys.find(key => pathToRegexp(key).exec(reqKey))

    if (!matched)
      return

    const api = cachedAPIs.get(matched)
    if (!api || !api.mockTemplate)
      return

    return mockjs.mock(api.mockTemplate)
  }

  return { schemas, generate, generateAll, remove, mock }
}

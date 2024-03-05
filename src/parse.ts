import type { Schema } from 'ts-json-schema-generator'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { createGenerator } from 'ts-json-schema-generator'

export interface CacheApi {
  key: string
  definition: JSONSchema7Definition
  root: JSONSchema7
}

export function parse(path: string) {
  return createGenerator({ path }).createSchema()
}

export function getRefObject(ref: string, schema?: Schema) {
  const paths = ref.replace(/^#\//, '').split('/')

  for (let index = 0; index < paths.length; index++) {
    const path = paths[index]
    // @ts-expect-error 获取 ref 对象
    schema = schema?.[path]
    if (!schema)
      return
  }
  return schema
}

export function getObjectPropertyByName(definition?: JSONSchema7Definition, property?: string) {
  if (!definition || typeof definition == 'boolean' || !definition.properties || !property)
    return

  if (!definition.properties[property])
    return

  return {
    property,
    definition: definition.properties[property],
    isRequire: definition.required?.includes(property) ?? false,
  }
}

export function getObjectProperties(definition?: JSONSchema7Definition) {
  if (!definition || typeof definition == 'boolean' || !definition.properties || definition.type !== 'object')
    return []

  const properties = definition.properties

  return Object.keys(properties).map((property) => {
    return {
      property,
      definition: properties[property],
      isRequire: definition.required?.includes(property) ?? false,
    }
  }).filter(el => typeof el.definition !== 'boolean') as { property: string, definition: JSONSchema7, isRequire: boolean }[]
}

export function getApis(rootSchema?: Schema) {
  if (!rootSchema || !rootSchema.$ref)
    return []

  const defaultExport = getRefObject(rootSchema.$ref, rootSchema)

  /**
   * 进行如下格式的代码转换
   * const original = {
   *    type: 'object',
   *    properties: {
   *      'admin/menu': {
   *        type: 'object',
   *        properties: {
   *          get: { },
   *        },
   *      },
   *      'admin/menu/{id}': {
   *        type: 'object',
   *        properties: {
   *          post: {  },
   *        },
   *      },
   *    },
   *  }
   *  const target = [
   *    { key: 'get__admin/menu', definition: {  }, root: {  } },
   *    { key: 'post__admin/menu/{id}', definition: {  }, root: {  } },
   *  ]
   */
  return getObjectProperties(defaultExport).map((url) => {
    const methods = getObjectProperties(url.definition)
    return methods.map((method) => {
      const param = getObjectPropertyByName(method.definition, 'param')
      const response = getObjectPropertyByName(method.definition, 'response')

      return {
        key: `${method.property.toLowerCase()}__${url.property}`.replace(/\{(.*?)\}/g, (_, name) => `:${name}`),
        root: rootSchema,
        param,
        response,
        definition: method.definition,
      }
    })
  }).flat()
}

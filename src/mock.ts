import mockjs from 'mockjs'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { getObjectProperties, getRefObject } from './parse'

const ALLOW_DEEP = 6

export function schema2MockTemp({
  rootSchema,
  schema,
  name,
  deep = 1,
}: { rootSchema: JSONSchema7, schema?: JSONSchema7, name?: string, deep?: number }) {
  // 获取嵌套接口
  if (schema?.$ref) {
    // 当嵌套深度超过允许的深度时，直接返回
    if (deep >= ALLOW_DEEP)
      return

    deep += 1
    schema = getRefObject(schema.$ref, rootSchema)
  }

  if (!schema)
    return

  if (schema.type === 'object')
    return objectSchema2MockTemp({ rootSchema, schema, deep })

  if (schema.type === 'array')
    return arraySchema2MockTemp({ rootSchema, schema, deep })

  return primitiveSchema2MockTemp(rootSchema, schema, name)
}

function arraySchema2MockTemp({ rootSchema, schema, deep }: { rootSchema: JSONSchema7, schema: JSONSchema7, deep: number }): any[] {
  if (!schema.items || typeof schema.items == 'boolean')
    return []
  const list = Array.isArray(schema.items) ? schema.items : [schema.items]
  return (list.filter(el => typeof el != 'boolean') as JSONSchema7[]).map(schema => schema2MockTemp({ rootSchema, schema, deep }))
}

function objectSchema2MockTemp({ rootSchema, schema, deep }: { rootSchema: JSONSchema7, schema: JSONSchema7, deep: number }) {
  const properties = getObjectProperties(schema)

  if (properties.length === 0)
    return {}

  return properties.reduce<Record<string, any>>((pre, { property, definition, isRequire }) => {
    const isRandom = Math.random() > 0.5
    if ((isRequire || isRandom) && typeof definition !== 'boolean') {
      let pattern = definition.pattern
      if (!pattern && definition.type === 'array')
        pattern = Math.floor((Math.random() * 20)).toLocaleString()

      const name = `${property}${pattern ? `|${pattern}` : ''}`
      pre[name] = schema2MockTemp({ rootSchema, schema: definition, deep })
    }

    return pre
  }, {})
}

const PRESET_STRING: Record<string, string> = {
  name: '@name',
  describe: '@sentence',
  date: '@date',
  time: '@time',
  title: '@title',
  id: '@uuid',
}
const PRESET_NUMBER: Record<string, string> = {
  id: '@interger',
}

function primitiveSchema2MockTemp(rootSchema: JSONSchema7, schema: JSONSchema7, name: string = '') {
  if (schema.type === 'string') {
    const { format } = schema
    return format?.replace('~', '@') ?? PRESET_STRING[name] ?? '@string'
  }

  if (schema.type === 'number') {
    const { format } = schema
    return isNumberString(format || '') ? Number(format) : format?.replace('~', '@') ?? PRESET_NUMBER[name] ?? '@natural'
  }

  if (schema.type === 'boolean') {
    const { format } = schema
    return format?.replace('~', '@') ?? '@boolean'
  }
}

const NUMBER_REG = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/
function isNumberString(val: string) {
  return NUMBER_REG.test(val)
}

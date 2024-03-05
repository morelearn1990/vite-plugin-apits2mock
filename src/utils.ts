import { resolve } from 'node:path'
import type { Key } from 'path-to-regexp'
import { pathToRegexp, regexpToFunction } from 'path-to-regexp'
import micromatch from 'micromatch'
import type { ResolvedOptions, ResolvedSingleOptions, UserOptions, UserSingleOptions } from './types'
import { pathToGlob } from './files'

export function resolveOptionsSingle(userOptions: UserSingleOptions): ResolvedSingleOptions {
  const {
    dir = './mock',
    delay = [0, 300],
    prefix = '',
    wrapper,
  } = userOptions

  // eslint-disable-next-line node/prefer-global/process
  const root = process.cwd()

  const negativeRe = micromatch.makeRe(pathToGlob(dir, root))

  return { root, dir, delay, prefix, negativeRe, wrapper }
}

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
  if (!Array.isArray(userOptions))
    userOptions = [userOptions]

  return userOptions.map(userOption => resolveOptionsSingle(userOption))
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(''), time)
  })
}

export function pathToReg<T extends object>(pathname: string) {
  const keys: Key[] = []
  const reg = pathToRegexp(pathname, keys)
  return {
    reg,
    getParams: (url: string): T => {
      const matchRes = regexpToFunction<T>(reg, keys, { decode: decodeURIComponent })(url)
      return matchRes === false ? ({} as T) : matchRes.params
    },
  }
}

export function urlToRegexp(path: string, method: string) {
  return pathToRegexp(`${method.toLowerCase()}__${path}`.replace(/\{(.*?)\}/g, (_, name) => {
    return `:${name}`
  }))
}

export function mergeWrapper(wrapper: Record<string, any>, inject: (string | number)[], template: any) {
  wrapper = JSON.parse(JSON.stringify(wrapper))

  let inner = wrapper
  for (let index = 0; index < inject.length; index++) {
    const key = inject[index]

    if (index === inject.length - 1)
      inner[key] = template

    else
      inner = inner[key]
  }

  return wrapper
}

export function parseWrapperInject(wrapper: Record<string, any>) {
  function parseObject(wrapper: Record<string, any>, nested: string): (string | number)[] | undefined {
    for (const key of Object.keys(wrapper)) {
      if (wrapper[key] === '@Interface')
        return [...nested, key]

      if (typeof wrapper[key] === 'object') {
        const result = parseObject(wrapper[key], `${nested}.${key}`)
        if (result)
          return result
      }

      if (Array.isArray(wrapper[key])) {
        const result = parseArray(wrapper[key], `${nested}.${key}`)
        if (result)
          return result
      }
    }
  }

  function parseArray(wrappers: any[], nested: string): (string | number)[] | undefined {
    for (let index = 0; index < wrappers.length; index++) {
      const item = wrappers[index]
      if (item === '@Interface')
        return [...nested, index]

      if (typeof item == 'object') {
        const result = parseObject(item, `${nested}.${index}`)
        if (result)
          return result
      }

      if (Array.isArray(item)) {
        const result = parseArray(item, `${nested}.${index}`)
        if (result)
          return result
      }
    }
  }

  return parseObject(wrapper, '')
}

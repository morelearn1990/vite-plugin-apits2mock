import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToRegexp, regexpToFunction } from 'path-to-regexp'
import { describe, expect, it } from 'vitest'

describe('utils', () => {
  it('url', () => {
    const regexp = pathToRegexp('get__/A/b/:id')

    console.log('test url', regexp, regexp.exec('get__/a/B/123'), regexp.exec('get__/a/b/123/1123'))
  })
})

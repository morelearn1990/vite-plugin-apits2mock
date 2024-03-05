import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createGenerator } from 'ts-json-schema-generator'

describe('parse ts', () => {
  it('exported', () => {
    const schema = createGenerator({
      path: 'test/targets/study.ts',
      jsDoc: 'basic',
    }).createSchema()

    console.log('111111', JSON.stringify(schema, null, 2))

    expect(1).toEqual(1)
  })
})

import { resolve } from 'node:path'
import fg from 'fast-glob'
import micromatch from 'micromatch'
import type { ResolvedOptions, ResolvedSingleOptions } from './types'

export async function getTSFiles(options: ResolvedSingleOptions): Promise<string[]> {
  const source = pathToGlob(options.dir, options.root)

  const files = await fg(source, { ignore: excludeToGlob(), onlyFiles: true })
  return files
}

export function pathToGlob(dir: string, root: string): string {
  const path = resolve(root, dir)
  return slash(`${path}/**/*.ts`)
}

function excludeToGlob(): string[] {
  return ['node_modules', '.git', '**/__*__/**']
}

export function isDir(file: string, options: ResolvedSingleOptions) {
  const dirPath = slash(resolve(options.root, options.dir))
  if (file.startsWith(dirPath))
    return true
  return false
}

export function isFile(file: string, options: ResolvedSingleOptions) {
  return options.negativeRe.test(file)
}

export function slash(str: string): string {
  return str.replace(/\\/g, '/')
}

export function pathToName(filepath: string) {
  return filepath.replace(/[_.\-\\/]/g, '_').replace(/[[:\]()]/g, '$')
}

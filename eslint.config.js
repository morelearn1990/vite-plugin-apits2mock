// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    rules: {
      'no-console': 'warn',
      'max-depth': ['error', 4],
      'max-params': ['error', 4],
      'complexity': ['error', 15],
      'max-nested-callbacks': ['error', 4],
    },
  },
)

// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    rules: {
      'antfu/top-level-function': 'off',
      'style/object-curly-spacing': 'warn',
      'ts/consistent-type-definitions': 'off',
    },
  }),
)

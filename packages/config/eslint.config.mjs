import js from '@eslint/js'

export default [
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    rules: {
      'no-console': 'warn',
    },
  },
]

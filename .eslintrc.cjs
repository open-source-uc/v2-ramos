module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier', 'astro', 'tailwindcss'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:astro/recommended',
		'plugin:tailwindcss/recommended',
		'plugin:prettier/recommended',
	],
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	overrides: [
		{
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
			rules: {
				'prettier/prettier': 'error',
			},
		},
	],
	rules: {
		'prettier/prettier': 'error',
		'tailwindcss/no-custom-classname': 'off',
	},
}

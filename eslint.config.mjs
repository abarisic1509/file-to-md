import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	prettierPlugin,
	{
		rules: {
			'prettier/prettier': 'warn',
			eqeqeq: 'error',
			'newline-before-return': 'error',
			'no-bitwise': 'error',
			'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
			'no-constant-binary-expression': 'error',
			'no-debugger': 'error',
			'no-extra-boolean-cast': 'off',
			'no-implicit-coercion': 'error',
			'no-lonely-if': 'error',
			'no-param-reassign': 'error',
			'no-unneeded-ternary': 'error',
			'no-sparse-arrays': 'off',
			'no-var': 'error',
			'no-void': 'error',
			'prefer-arrow-callback': 'error',
			'prefer-const': 'error',
			'require-await': 'error',
			'@typescript-eslint/method-signature-style': 'error',
			'@typescript-eslint/no-confusing-non-null-assertion': 'error',
			'@typescript-eslint/no-inferrable-types': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'local',
					args: 'after-used',
					caughtErrors: 'none',
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-useless-empty-export': 'error',
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
		},
	},

	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),
]);

export default eslintConfig;

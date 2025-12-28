import { CodegenConfig } from '@graphql-codegen/cli';
import { API_BASE_URL } from './src/utils/api.ts';

const config: CodegenConfig = {
	schema: `${API_BASE_URL}/graphql`,
	documents: ['src/**/*.{ts,tsx}'],
	generates: {
		'./src/__generated__/': {
			preset: 'client',
			plugins: [],
			presetConfig: {
				gqlTagName: 'gql',
			}
		}
	},
	ignoreNoDocuments: true,
};

export default config;

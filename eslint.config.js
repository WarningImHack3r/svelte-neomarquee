import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier/flat";
import svelte from "eslint-plugin-svelte";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import svelteConfig from "./svelte.config.js";

export default defineConfig(
	eslint.configs.recommended,
	svelte.configs.recommended,
	prettierConfig,
	svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				svelteConfig
			}
		}
	},
	globalIgnores(["build/", ".svelte-kit/", "dist/"])
);

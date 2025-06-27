// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
//        "extends": [ "google" ],
		rules: {
			semi: "error",
			"prefer-const": "error",
		},
	},
]);
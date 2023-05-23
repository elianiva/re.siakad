import { type Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
		fontFamily: {
			sans: ["Nunito", "sans-serif"],
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
	plugins: [require("tailwind-scrollbar")({ nocompatible: true }), require("@tailwindcss/typography")],
} satisfies Config;

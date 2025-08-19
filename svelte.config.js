import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      handleHttpError: "ignore",
    },
    files: {
      lib: "./src/lib/",
    },
    paths: {
            base: '/cafe'
        }
  },
  relative: true,
  preprocess: [vitePreprocess()],
};

export default config;

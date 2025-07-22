import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
// import { importAssets } from 'svelte-preprocess-import-assets';
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
  },
  relative: true,
  preprocess: [vitePreprocess()],
};

export default config;

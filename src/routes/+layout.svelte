<script>
  let { children } = $props();
  import "../app.css";
  import { setContext } from "svelte";

  function simplify(obj, path) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key.split(path)[1], value]),
    );
  }

  const images = import.meta.glob(
    "$lib/assets/images/**/*.{jpg,jpeg,png,webp}",
    {
      eager: true,
      import: "default",
    },
  );

  const videos = import.meta.glob("$lib/assets/videos/**/*.{mp4,webm}", {
    eager: true,
    import: "default",
  });

  setContext("images", simplify(images, "/assets/images/"));
  setContext("videos", simplify(videos, "/assets/videos/"));
</script>

{@render children()}

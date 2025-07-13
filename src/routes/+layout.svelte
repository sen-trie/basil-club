<script>
  let { children } = $props();
  import "../app.css";
  import { setContext } from "svelte";

  const images = import.meta.glob(
    "$lib/assets/images/**/*.{jpg,jpeg,png,webp}",
    {
      eager: true,
      import: "default",
    }
  );

  const simplifiedImages = Object.fromEntries(
    Object.entries(images).map(([key, value]) => [
      key.split("/assets/images/")[1],
      value,
    ])
  );

  setContext("images", simplifiedImages);
</script>

{@render children()}

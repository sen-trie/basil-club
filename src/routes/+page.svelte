<script>
  import App from "./App.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    const handleTouchMove = (e) => {
      if (e.target.closest(".scrollable")) return;

      if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  });
</script>

<div>
  <App />
</div>

<style>
  :global(body) {
    margin: 0;
  }

  div {
    position: relative;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    background: rgb(13, 19, 32);
    background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
  }
</style>

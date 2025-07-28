<script>
  import Panzoom from "@panzoom/panzoom";
  import { getContext } from "svelte";

  const image = getContext("images");

  let imagePanZoom = $state(null);

  $effect(async () => {
    if (!imagePanZoom) return;

    const panzoom = Panzoom(imagePanZoom, {
      contain: "outside",
      startScale: 2,
      minScale: 1,
      maxScale: 3,
    });
    imagePanZoom.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);
    setTimeout(() => {
      panzoom.pan(0, 1);
    }, 10);
  });
</script>

<div class="grid-div">
  <img
    bind:this={imagePanZoom}
    src={image[`grid.webp`]}
    alt="Framed grid"
    class="photo-grid"
  />
</div>

<style>
  .photo-grid {
    position: relative;
    height: 80%;
    object-fit: contain;
  }

  .grid-div {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
</style>

<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();
</script>

<div>
  <button
    class="bg-amber-50 cursor-pointer"
    onclick={() => {
      scene.setFloor(0);
    }}>Show All</button
  >
  <button
    class="bg-amber-50 cursor-pointer"
    onclick={() => {
      scene.setFloor(1);
    }}>Show Top</button
  >
  <button
    class="bg-amber-50 cursor-pointer"
    onclick={() => {
      scene.setFloor(2);
    }}>Show Bottom</button
  >
</div>

<style>
</style>

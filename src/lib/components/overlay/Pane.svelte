<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();
</script>

{#if scene.currentState.currentFloor === 0}
  All
{:else if scene.currentState.currentFloor === 1}
  1F
{:else}
  B1F
{/if}

<style>
</style>

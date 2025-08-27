<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import Layer from "$lib/assets/ui/layer.svelte";
  const scene = getScene();
</script>

{#if scene.currentState.currentFloor === 0}
  <Layer />
{:else if scene.currentState.currentFloor === 1}
  1F
{:else}
  B1F
{/if}

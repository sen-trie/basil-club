<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();

  const switchFloor = () => {
    if (scene.currentState.currentFloor === 0) {
      scene.setFloor(1);
    } else if (scene.currentState.currentFloor === 1) {
      scene.setFloor(2);
    } else {
      scene.setFloor(0);
    }
  };
</script>

<button class="overlay-element" onclick={switchFloor}>
  {#if scene.currentState.currentFloor === 0}
    All
  {:else if scene.currentState.currentFloor === 1}
    1F
  {:else}
    B1F
  {/if}
</button>

<style>
</style>

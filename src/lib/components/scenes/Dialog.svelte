<script>
  import { fly } from "svelte/transition";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();

  const dialogObj = {
    bear: "A low growl can be heard from the café.",
    men: "The men's restroom is currently unavailable. Come back later.",
  };
</script>

{#if scene.currentState.showDialog !== null}
  <button
    class="dialog"
    transition:fly={{ y: 150, duration: 450 }}
    onclick={scene.closeDialog}
  >
    <p>
      {dialogObj[scene.currentState.showDialog]}
    </p>
  </button>
{/if}

<style>
  .dialog {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    width: min(500px, 90%);
    translate: -50% 0;
    padding: 1rem 1.5rem;
    font-size: 1.6rem;
    line-height: 2rem;
    background: var(--colour-black);
    color: var(--colour-light);
    border: 2px solid var(--colour-dark);
    border-radius: 20px;
    z-index: 3;
  }
</style>

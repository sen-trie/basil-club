<script>
  import { onMount } from "svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import { fade } from "svelte/transition";
  import Pane from "./overlay/Pane.svelte";
  import Closeup from "./scenes/Closeup.svelte";
  import Dialog from "./scenes/Dialog.svelte";
  import Audio from "./overlay/Audio.svelte";
  import ArrowBack from "$lib/assets/ui/arrow-back.svelte";

  let audioEl = $state(null);

  onMount(() => {
    console.log("page start");
  });

  const scene = getScene();
</script>

<!-- TODO Disable when hud -->
<div transition:fade={{ duration: 400, delay: 500 }} class="overlay-screen">
  <!-- <Audio bind:this={audioEl} /> -->
  <p class="interactable-count">
    {scene.countInteractables} / {scene.maxInteractables}
  </p>
  {#if scene.currentState.povCamera}
    <button
      class="overlay-element"
      onclick={() => {
        scene.togglePOVCamera();
      }}
    >
      <ArrowBack />
    </button>
  {:else if scene.currentState.scene !== "cafe"}
    <button
      class="overlay-element"
      onclick={() => {
        scene.setCafe();
      }}
    >
      <ArrowBack />
    </button>
  {:else if scene.currentState.scene === "cafe"}
    <Pane />
  {/if}
</div>
<Closeup />
<Dialog />

<style>
  .overlay-screen {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: end;
    z-index: 10;
    overflow: hidden;
    padding: 1rem 2rem;
    gap: 1.5rem;
  }

  .interactable-count {
    position: relative;
    right: -2rem;
    padding: 0.5rem 2rem;
    padding-left: 6rem;
    font-size: 2.5rem;
    font-weight: 700;
    text-align: right;
    background: rgb(68, 34, 20, 1);
    background: linear-gradient(
      -90deg,
      rgb(53, 29, 19) 0%,
      rgb(68, 34, 20, 1) 75%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  p,
  button {
    color: var(--colour-light);
  }
</style>

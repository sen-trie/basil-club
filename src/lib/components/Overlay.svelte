<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import Pane from "./overlay/Pane.svelte";
  import Closeup from "./scenes/Closeup.svelte";
  import Dialog from "./scenes/Dialog.svelte";
  import Audio from "./overlay/Audio.svelte";
  import ArrowBack from "$lib/assets/ui/arrow-back.svelte";

  let pageStarted = $state(false);
  let audioEl = $state(null);

  $effect(() => {
    if (pageStarted) {
      audioEl.playBGM;
    }
  });

  const scene = getScene();
</script>

<!-- TODO Disable when hud -->
<div class="overlay-screen">
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

<!-- {#if !pageStarted}
  <div class="overlay-screen intro-screen">
    <button
      onclick={() => {
        pageStarted = true;
      }}>START</button
    >
  </div>
{/if} -->

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
    text-align: right;
    background: rgb(68, 34, 20, 1);
    background: linear-gradient(
      -90deg,
      rgb(53, 29, 19) 0%,
      rgb(68, 34, 20, 1) 75%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .intro-screen {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  p {
    color: white;
  }
</style>

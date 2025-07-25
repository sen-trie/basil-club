<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import Pane from "./overlay/Pane.svelte";
  import Closeup from "./scenes/Closeup.svelte";
  import Audio from "./overlay/Audio.svelte";

  let pageStarted = $state(false);
  let audioEl = $state(null);

  $effect(() => {
    if (pageStarted) {
      audioEl.playBGM;
    }
  });

  const scene = getScene();
</script>

<div class="overlay-screen">
  <!-- <Audio bind:this={audioEl} /> -->
  <p>{scene.countInteractables}/{scene.maxInteractables}</p>
  {#if scene.currentState.povCamera}
    <button
      onclick={() => {
        scene.togglePOVCamera();
      }}>Back</button
    >
  {:else if scene.currentState.scene !== "cafe"}
    <button
      onclick={() => {
        scene.setCafe();
      }}>Back</button
    >
  {:else if scene.currentState.scene === "cafe"}
    <Pane />
  {/if}
</div>
<Closeup />

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
    display: flex;
    z-index: 10;
    overflow: hidden;
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

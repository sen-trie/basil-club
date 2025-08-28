<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import { fade } from "svelte/transition";
  import Pane from "./overlay/Pane.svelte";
  import Closeup from "./scenes/Closeup.svelte";
  import Dialog from "./scenes/Dialog.svelte";
  import InfoBox from "./scenes/InfoBox.svelte";
  import ArrowBack from "$lib/assets/ui/arrow-back.svelte";
  import VolOn from "$lib/assets/ui/vol-on.svelte";
  import VolMute from "$lib/assets/ui/vol-mute.svelte";

  const scene = getScene();

  let infoOpen = $state(false);
</script>

<div
  transition:fade={{ duration: 400, delay: 500 }}
  class="overlay-screen"
  class:f-toilet={scene.currentState.scene === "fToilet"}
  class:m-toilet={scene.currentState.scene === "mToilet"}
>
  <button
    class="interactable-count"
    onclick={() => {
      scene.rollDialog();
    }}
  >
    {scene.countInteractables} / {scene.maxInteractables}
  </button>
  <button
    class="overlay-element info"
    onclick={() => {
      infoOpen = true;
    }}
  >
    i
  </button>
  <button
    class="overlay-element"
    onclick={() => {
      scene.toggleAudio();
    }}
  >
    {#if scene.currentState.muted}
      <VolMute />
    {:else}
      <VolOn />
    {/if}
  </button>
  <button
    class="overlay-element"
    onclick={() => {
      if (scene.currentState.povCamera) {
        scene.togglePOVCamera();
      } else if (scene.currentState.scene !== "cafe") {
        scene.setCafe();
      } else {
        scene.cycleFloor();
      }
    }}
  >
    {#if scene.currentState.povCamera || scene.currentState.scene !== "cafe"}
      <ArrowBack />
    {:else if scene.currentState.scene === "cafe"}
      <Pane />
    {/if}
  </button>
</div>

<InfoBox
  {infoOpen}
  closeInfo={() => {
    infoOpen = false;
  }}
/>
<Closeup />
<Dialog />

<style>
  @property --c0 {
    syntax: "<color>";
    initial-value: #73e414;
    inherits: false;
  }

  @property --c1 {
    syntax: "<color>";
    initial-value: rgb(74, 164, 245);
    inherits: false;
  }

  .overlay-screen {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    z-index: 10;
    overflow: hidden;
    padding: 1rem 1rem;
    gap: 1.5rem;
    pointer-events: none;
  }

  .overlay-screen > * {
    pointer-events: auto;
  }

  .info {
    font-size: 2.4rem;
    font-weight: 700;
  }

  .interactable-count {
    position: relative;
    font-size: 2.5rem;
    font-weight: 700;
    text-align: right;
    cursor: pointer;
    transition: background 3.8s ease;
    transition-property: --c0, --c1;

    position: absolute;
    left: 0rem;
    right: unset;
    background: linear-gradient(90deg, var(--c0) 0%, var(--c1) 75%, transparent 100%);
    padding: 0.5rem 2rem;
    padding-right: 6rem;
  }

  .overlay-screen .interactable-count {
    --c0: var(--colour-black);
    --c1: var(--colour-dark);
  }

  .overlay-screen.f-toilet .interactable-count {
    --c0: var(--ftoilet-dark);
    --c1: var(--ftoilet-light);
  }

  .overlay-screen.m-toilet .interactable-count {
    --c0: var(--mtoilet-dark);
    --c1: var(--mtoilet-light);
  }

  button {
    color: var(--colour-white);
  }

  @media (max-width: 768px) {
    .overlay-screen {
      padding: 1rem 0;
      padding-right: 5px;
      gap: 10px;
    }

    .overlay-element {
      width: 55px;
      height: 55px;
      border-width: 3px;
      font-size: 1.2rem;
      margin-right: 5px;
    }

    .info {
      font-size: 2rem;
    }

    .interactable-count {
      padding: 0.5rem 2rem;
      padding-right: 4rem;
      font-size: 1.6rem;
    }
  }
</style>

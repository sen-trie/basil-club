<script>
  import { fly, fade } from "svelte/transition";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import { showBlocker as showBlockerStore } from "$lib/stores/sceneControls";
  import { getContext, onMount } from "svelte";
  import Photo from "$lib/components/scenes/closeup/Photo.svelte";
  import Grid from "$lib/components/scenes/closeup/Grid.svelte";
  import Flag from "$lib/components/scenes/closeup/Flag.svelte";
  import Cashier from "$lib/components/scenes/closeup/Cashier.svelte";
  import ArrowDown from "$lib/assets/ui/arrow-down.svelte";

  const image = getContext("images");
  const video = getContext("videos");
  const scene = getScene();

  let blocker = $state(false);
  let overlayVisible = $derived(scene.currentState.overlayType !== "");
  let hideButton = $state(false);

  let closeEatTimer = null;
  let flagScroll = $state(0);

  $effect(() => {
    hideButton = ["bear", "flag", "eat"].includes(scene.currentState.overlayType);

    if (scene.currentState.overlayType === "eat") {
      clearTimeout(closeEatTimer);
      closeEatTimer = setTimeout(() => {
        scene.closeOverlay();
      }, scene.eatTime);
    }
  });

  const showBlocker = () => {
    blocker = true;
    setTimeout(() => {
      blocker = false;
    }, 600);
  };
  showBlockerStore.set(showBlocker);

  onMount(() => {
    const preloadImages = [
      ...Array.from({ length: 7 }, (_, i) => `spread/${i + 1}.webp`),
      "grid.webp",
      "eat.apng",
    ];
    preloadImages.forEach((imgPath) => {
      const img = new Image();
      img.src = image[imgPath];
    });
  });
</script>

{#if overlayVisible}
  <div
    class:no-bg={scene.currentState.overlayType === "eat"}
    class:no-pointer={scene.currentState.overlayType === "hud"}
    class="close-up flex"
    transition:fly={{ y: 150, duration: 300, opacity: 0 }}
  >
    {#if scene.currentState.overlayType === "photo"}
      <Photo />
    {:else if scene.currentState.overlayType === "grid"}
      <Grid />
    {:else if scene.currentState.overlayType === "bear"}
      <div class="grid-div">
        <video
          autoplay
          playsinline
          onended={scene.closeOverlay}
          controls={false}
          style="pointer-events: none;"
          oncontextmenu={(e) => e.preventDefault()}
        >
          <source src={video["bear.webm"]} type="video/webm" />
          <source src={video["bear.mp4"]} type="video/mp4" />
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      </div>
    {:else if scene.currentState.overlayType === "flag"}
      <Flag bind:flagScroll />
    {:else if scene.currentState.overlayType === "eat"}
      <img
        class="eat-img"
        class:matcha={["matcha-muffin", "matcha-cake"].includes(scene.currentState.currentPlate)}
        class:earlgrey={scene.currentState.currentPlate === "earlgrey-cheesecake"}
        class:custard={scene.currentState.currentPlate === "cremebrulee"}
        class:brownie={["brownie-cheesecake", "choc-cremebrulee", "lava-cake"].includes(
          scene.currentState.currentPlate,
        )}
        src={`${image["eat.apng"]}?v=${Date.now()}`}
        alt="eating animation"
      />
    {:else if scene.currentState.overlayType === "payment"}
      <Cashier />
    {/if}

    {#if !hideButton}
      <button class="close-button drop-shadow" onclick={scene.closeOverlay}>
        <ArrowDown />
      </button>
    {/if}
  </div>
{/if}

{#if blocker}
  <div class="blocker" transition:fade={{ duration: 250, delay: 0 }}></div>
{/if}

<style>
  .close-up {
    position: absolute;
    color: var(--colour-light);
    width: 100dvw;
    height: 100dvh;
    z-index: 10;
    fill: var(--colour-light);
    background-color: rgba(0, 0, 0, 0.7);
  }

  .flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .blocker {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 1);
    pointer-events: all;
    z-index: 99;
  }

  .no-pointer {
    pointer-events: none;
    background: none;
  }

  .no-bg {
    background-color: transparent;
  }

  .drop-shadow {
    filter: drop-shadow(0 0 0.2rem black);
  }

  .close-button {
    position: absolute;
    bottom: 0;
    pointer-events: all;
    will-change: transform;
    transition: transform 0.2s ease;
  }

  .close-button:hover {
    transform: translateY(10px);
  }

  .grid-div {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .eat-img {
    position: absolute;
    bottom: 0;
    /* width: min(1000px, 100%); */
    width: 100%;
    height: 100%;
    height: auto;
    object-fit: contain;
  }

  .eat-img.matcha {
    filter: hue-rotate(45deg) brightness(0.8);
  }

  .eat-img.earlgrey {
    filter: hue-rotate(350deg) brightness(1) saturate(0.8);
  }

  .eat-img.custard {
    filter: hue-rotate(10deg) brightness(1.3);
  }

  /* .eat-img.lemon {
    filter: hue-rotate(28deg) brightness(1.6);
  } */

  .eat-img.brownie {
    filter: hue-rotate(350deg) brightness(0.4);
  }

  @media (max-width: 768px) {
    .eat-img {
      transform: scale(1.4);
      transform-origin: bottom;
    }
  }
</style>

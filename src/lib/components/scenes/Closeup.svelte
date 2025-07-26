<script>
  import { fly, fade } from "svelte/transition";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import { showBlocker as showBlockerStore } from "$lib/stores/sceneControls";
  import { getContext, onMount } from "svelte";
  import Panzoom from "@panzoom/panzoom";

  const image = getContext("images");
  const video = getContext("videos");
  const scene = getScene();

  let blocker = $state(false);
  let currentImage = $state(1);
  let imageHover = $state(null);
  let overlayVisible = $derived(scene.currentState.overlayType !== "");
  let imagePanZoom = $state(null);
  let hideButton = $state(false);

  let animationFrame;
  const THRESHOLD = 15;

  function handleMove(e) {
    if (animationFrame) return;

    const { clientX, clientY, currentTarget } = e;
    animationFrame = requestAnimationFrame(() => {
      const { clientWidth, clientHeight } = currentTarget;
      const rect = currentTarget.getBoundingClientRect();
      const offsetLeft = rect.left;
      const offsetTop = rect.top;

      const horizontal = (clientX - offsetLeft) / clientWidth;
      const vertical = (clientY - offsetTop) / clientHeight;
      const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
      const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

      imageHover.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
      animationFrame = null;
    });
  }

  function resetMove(e) {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    imageHover.style.transition = "transform 0.3s ease-out";
    imageHover.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
    setTimeout(() => {
      imageHover.style.transition = "transform 0.1s ease";
    }, 300);
  }

  function nextImage(inverse = false) {
    const maxImage = 7;
    if (inverse) {
      currentImage = currentImage > 1 ? currentImage - 1 : maxImage;
      return;
    }
    currentImage = currentImage < maxImage ? currentImage + 1 : 1;
  }

  onMount(() => {
    const preloadImages = ["spread/1.webp", "grid.webp"];
    preloadImages.forEach((imgPath) => {
      const img = new Image();
      img.src = image[imgPath];
    });
  });

  $effect(async () => {
    if (!imagePanZoom) return;

    const panzoom = Panzoom(imagePanZoom, {
      contain: "outside",
      startScale: 2,
      minScale: 1,
      maxScale: 3,
    });
    imagePanZoom.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);
    setTimeout(() => {
      panzoom.pan(0, 1);
    }, 10);
  });

  $effect(() => {
    hideButton = scene.currentState.overlayType === "bear";
  });

  const showBlocker = () => {
    blocker = true;
    setTimeout(() => {
      blocker = false;
    }, 600);
  };
  showBlockerStore.set(showBlocker);
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
{#if overlayVisible}
  <div
    class:no-pointer={scene.currentState.overlayType === "hud"}
    class="close-up flex"
    transition:fly={{ y: 150, duration: 300 }}
  >
    {#if scene.currentState.overlayType === "photo"}
      <button
        onclick={() => {
          nextImage(true);
        }}>PREVIOUS</button
      >
      <img
        bind:this={imageHover}
        src={image[`spread/${currentImage}.webp`]}
        alt="F from context"
        class="photo-spread"
        onmousemove={handleMove}
        onmouseleave={resetMove}
      />
      <button
        onclick={() => {
          nextImage(false);
        }}>NEXT</button
      >
    {:else if scene.currentState.overlayType === "grid"}
      <div class="grid-div">
        <img
          bind:this={imagePanZoom}
          src={image[`grid.webp`]}
          alt="Framed grid"
          class="photo-grid"
        />
      </div>
    {:else if scene.currentState.overlayType === "bear"}
      <div class="grid-div">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video autoplay onended={scene.closeOverlay}>
          <source src={video["bear.mp4"]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    {:else if scene.currentState.overlayType === "checkout"}
      <div class="checkout-div flex">
        <div class="checkout-box">
          <p>ORDERS RECEIVED: NONE</p>
        </div>
      </div>
    {/if}

    {#if !hideButton}
      <button class="close-button" onclick={scene.closeOverlay}>Close</button>
    {/if}
  </div>
{/if}

{#if blocker}
  <div class="blocker" transition:fade={{ duration: 250, delay: 0 }}></div>
{/if}

<style>
  .flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .close-up {
    position: absolute;
    color: white;
    width: 100dvw;
    height: 100dvh;
    z-index: 10;
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
  }

  .close-button {
    position: absolute;
    bottom: 1rem;
    pointer-events: all;
  }

  .photo-spread {
    height: 70%;
    max-width: 80%;
    object-fit: contain;
    transition: transform 0.1s ease;
    transform-style: preserve-3d;
    will-change: transform;
    /* transition: transform 0.1s; */
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

  .photo-grid {
    position: relative;
    height: 80%;
    object-fit: contain;
  }

  .checkout-div {
    --border-size: 2rem;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 1.5%;
    height: 85%;
    width: auto;
    max-width: 90%;
    aspect-ratio: 12/16;
    border-radius: var(--border-size);
    background-color: grey;
  }

  .checkout-div .checkout-box {
    width: calc(100% - var(--border-size) * 2);
    height: calc(100% - var(--border-size) * 2);
    background-color: black;
  }
</style>

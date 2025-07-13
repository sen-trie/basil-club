<script>
  import { fly } from "svelte/transition";
  import { showOverlay as showOverlayStore } from "$lib/stores/sceneControls";
  import { getContext } from "svelte";

  const image = getContext("images");

  let currentImage = $state(1);
  let imageHover = $state(null);
  let overlayVisible = $state(false);

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

  const showOverlay = () => {
    overlayVisible = !overlayVisible;
  };
  showOverlayStore.set(showOverlay);

  const closeOverlay = () => {
    overlayVisible = false;
  };
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
{#if overlayVisible}
  <div transition:fly={{ y: 150, duration: 300, delay: 100 }}>
    <button
      onclick={() => {
        nextImage(true);
      }}>PREVIOUS</button
    >
    <img
      bind:this={imageHover}
      src={image[`spread/${currentImage}.webp`]}
      alt="F from context"
      onmousemove={handleMove}
      onmouseleave={resetMove}
    />
    <button onclick={nextImage}>NEXT</button>
    <button onclick={closeOverlay}>Close</button>
  </div>
{/if}

<style>
  div {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: white;
    width: 100dvw;
    height: 100dvh;
    z-index: 10;
  }

  img {
    height: 70%;
    max-width: 80%;
    object-fit: contain;
    transition: transform 0.1s ease;
    transform-style: preserve-3d;
    will-change: transform;
    /* transition: transform 0.1s; */
  }
</style>

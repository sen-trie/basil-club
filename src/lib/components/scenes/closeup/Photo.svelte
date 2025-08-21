<script>
  import { getContext } from "svelte";
  import ArrowLeft from "$lib/assets/ui/arrow-left.svelte";
  import ArrowRight from "$lib/assets/ui/arrow-right.svelte";

  const image = getContext("images");
  let currentImage = $state(1);
  let imageHover = $state(null);

  let animationFrame;
  const THRESHOLD = 15;

  let touchMoved = false;

  function handleStart(e) {
    touchMoved = false;
    if (e.type === "touchstart") {
      // give feedback even on a tap
      const target = e.currentTarget;
      target.style.transition = "transform 0.1s ease";
      target.style.transform = `perspective(${target.clientWidth}px) scale3d(0.98,0.98,1)`; // slight press
    }
  }

  function handleMove(e) {
    if (animationFrame) return;

    let clientX, clientY;
    if (e.type.startsWith("touch")) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
      if (e.type === "touchmove") touchMoved = true;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const { currentTarget } = e;

    animationFrame = requestAnimationFrame(() => {
      const { clientWidth, clientHeight } = currentTarget;
      const rect = currentTarget.getBoundingClientRect();

      const horizontal = (clientX - rect.left) / clientWidth;
      const vertical = (clientY - rect.top) / clientHeight;
      const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
      const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

      currentTarget.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1,1,1)`;
      animationFrame = null;
    });
  }

  function resetMove(e) {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    const target = e.currentTarget;
    target.style.transition = "transform 0.3s ease-out";
    target.style.transform = `perspective(${target.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
    setTimeout(() => {
      target.style.transition = "transform 0.1s ease";
    }, 300);

    touchMoved = false;
  }

  function nextImage(inverse = false) {
    const maxImage = 7;
    if (inverse) {
      currentImage = currentImage > 1 ? currentImage - 1 : maxImage;
      return;
    }
    currentImage = currentImage < maxImage ? currentImage + 1 : 1;
  }
</script>

<div class="flex-h spread-container scrollable">
  <button
    class="drop-shadow left-arrow"
    onclick={() => {
      nextImage(true);
    }}
    ><ArrowLeft />
  </button>

  <img
    bind:this={imageHover}
    src={image[`spread/${currentImage}.webp`]}
    alt="Spread"
    class="photo-spread"
    onmousemove={handleMove}
    onmouseleave={resetMove}
    ontouchstart={handleStart}
    ontouchmove={handleMove}
    ontouchend={resetMove}
    ontouchcancel={resetMove}
  />

  <button
    class="drop-shadow right-arrow"
    onclick={() => {
      nextImage(false);
    }}
    ><ArrowRight />
  </button>
</div>

<style>
  .photo-spread {
    min-height: 70%;
    max-height: 70vh;
    height: 70%;
    max-width: 80%;
    min-width: 50%;
    object-fit: contain;
    margin: 0 1rem;
    transition: transform 0.1s ease;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .left-arrow,
  .right-arrow {
    will-change: transform;
    transition: transform 0.2s ease;
  }

  .left-arrow:hover {
    transform: translateX(-5px);
  }

  .right-arrow:hover {
    transform: translateX(5px);
  }

  @media (max-width: 768px) {
    .spread-container {
      display: grid;
      grid-template-areas:
        "image"
        "arrows";
      justify-items: center;
      gap: 0.5rem;
      height: 80dvh;
      width: 100dvw;
    }

    .photo-spread {
      grid-area: image;
      max-width: 100%;
      height: auto;
    }

    .left-arrow,
    .right-arrow {
      grid-area: arrows;
    }

    .left-arrow {
      margin-right: 50%;
    }

    .right-arrow {
      margin-left: 50%;
    }
  }
</style>

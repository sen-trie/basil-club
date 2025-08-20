<script>
  import { getContext } from "svelte";
  import ArrowLeft from "$lib/assets/ui/arrow-left.svelte";
  import ArrowRight from "$lib/assets/ui/arrow-right.svelte";

  const image = getContext("images");
  let currentImage = $state(1);
  let imageHover = $state(null);

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
</script>

<div class="flex-h spread-container">
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
      grid-template-columns: 1fr 1fr;
      height: max(400px, 80vh);
      width: 100dvw;
    }

    .photo-spread {
      max-width: 90%;
    }

    .left-arrow {
      grid-column: 1 / 2;
      grid-row-start: 2;
    }

    .photo-spread {
      grid-column: span 2;
      justify-self: center;
      height: 100%;
      width: 100%;
    }

    .left-arrow,
    .right-arrow {
      align-self: flex-start;
    }
  }
</style>

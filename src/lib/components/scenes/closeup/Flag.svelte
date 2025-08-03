<script>
  import { blur } from "svelte/transition";
  import { getContext } from "svelte";
  import { onMount } from "svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();
  const image = getContext("images");

  const categories = [
    {
      name: "Pastries",
      items: ["Financier", "Yuzu Financier", "Matcha Muffin", "Melonpan"],
    },
    {
      name: "Cakes",
      items: [
        "Lava Cake",
        "Yuzu Molten Cake",
        "Matcha Molten Cake",
        "Cheesecake",
        "Lemon Basque Cheesecake",
        "Earl Grey Basque Cheesecake",
        "Brownie Basque Cheesecake",
      ],
    },
    { name: "Custards", items: ["Crème Brûlée", "Chocolate Crème Brûlée"] },
  ];

  let refs = $state({});
  let currentHeader = $state(categories[0].name);
  let orderBox = $state(null);
  let confirmState = $state(false);
  let currentOrder = $state(null);
  let waitTimer = $state(null);
  let waitFinished = $state(false);

  function scrollToCategory(name) {
    refs[name]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) currentHeader = e.target.dataset.name;
        });
      },
      { root: orderBox, threshold: 0.5 },
    );

    categories.forEach((cat) => {
      const element = refs[cat.name];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  });

  $effect(() => {
    if (currentOrder !== null) {
      waitTimer = setTimeout(() => {
        scene.setPlate("cheesecake");
        waitFinished = true;
      }, 3000);
    }
  });

  // TODO: RETEXTURE TABLET BLACK
</script>

<div class="flag-wrapper flexbox">
  <div class="flag-tablet order-ui">
    <div class="order-header flexbox">
      <div class="header-left">
        <p class="header-title">Menu</p>
        <nav class="navbar">
          {#each categories as cat}
            <button
              class:selected={currentHeader === cat.name}
              onclick={() => scrollToCategory(cat.name)}
            >
              {cat.name}
            </button>
          {/each}
        </nav>
      </div>
      <img class="header-logo" alt="Cafe logo" src={image[`tablet/logo.webp`]} />
    </div>
    <div class="order-box" bind:this={orderBox}>
      {#each categories as cat}
        <section>
          <h2 bind:this={refs[cat.name]} data-name={cat.name}>{cat.name}</h2>
          {#each cat.items as item}
            <div class="food-box">
              <p>{item}</p>
              <img alt="Food item" src={image[`tablet/logo.webp`]} />
              <button
                class:order-button-red={currentOrder === item}
                onclick={() => {
                  if (currentOrder === item) {
                    confirmState = item;
                  } else {
                    currentOrder = item;
                  }
                }}
              >
                {currentOrder === item ? "Confirm?" : "Order"}
              </button>
            </div>
          {/each}
        </section>
      {/each}
    </div>
    {#if confirmState}
      <div class="order-confirm flex-v" transition:blur={{ duration: 450 }}>
        <div class="confirm-info flex-v">
          {#if !waitFinished}
            <p>Sending order</p>
            <button class="exit-button" aria-label="Put down tablet" disabled>
              Please Wait...
            </button>
          {:else}
            <p>Your order is confirmed!</p>
            <button class="exit-button" onclick={scene.closeOverlay} aria-label="Put down tablet">
              Return
            </button>
          {/if}
        </div>
      </div>
    {/if}
    <button class="tablet-button" onclick={scene.closeOverlay} aria-label="Put down tablet"
    ></button>
  </div>
</div>

<style>
  :root {
    --padding-v: 80px;
    --padding-h: 35px;
  }

  .flag-wrapper {
    position: relative;
    width: 95%;
    height: 97%;
  }

  .flag-tablet {
    position: absolute;
    inset: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 2 / 3;
    border: 3px solid var(--colour-grey);
    border-radius: var(--padding-h);
    background-color: var(--colour-light);
    padding: var(--padding-v) var(--padding-h);
    overflow: hidden;
  }

  .flag-tablet::before {
    background: none;
    border: var(--padding-h) solid #0e0d0d;
    border-top-width: var(--padding-v);
    border-bottom-width: var(--padding-v);
    border-radius: calc(var(--padding-h) - 3px);
    content: "";
    display: block;
    position: absolute;
    pointer-events: none;
    inset: 0;
  }

  .tablet-button {
    position: absolute;
    left: 50%;
    bottom: calc(var(--padding-v) / 2);
    transform: translate(-50%, 50%);
    z-index: 999;
    width: calc(var(--padding-v) / 1.5);
    height: calc(var(--padding-v) / 1.5);
    border-radius: 50%;
    border: 2px solid rgb(65, 61, 61);
    background-color: #292626;
  }

  .order-ui {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .order-header {
    background-color: var(--colour-black);
    padding: 0.5rem 1rem;
    color: var(--colour-light);
    font-size: 1.8rem;
  }

  .header-title {
    font-weight: 700;
    color: var(--colour-light);
  }

  .header-logo {
    height: 90px;
    width: auto;
    aspect-ratio: 1;
    margin-right: 0.5rem;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.5));
  }

  .navbar button {
    color: var(--colour-light);
    margin-right: 1.4rem;
    font-size: 1.4rem;
    opacity: 0.7;
    transition: opacity 0.5s ease;
  }

  .navbar button.selected {
    color: var(--colour-light);
    font-weight: bold;
    border-bottom: 2px solid var(--colour-light);
    opacity: 1;
  }

  h2,
  div {
    color: var(--colour-black);
  }

  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  section div {
    text-align: center;
  }

  section h2 {
    grid-column: span 2;
  }

  .order-box {
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 1rem 1rem;
  }

  .order-box .food-box {
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0.75rem;
    font-size: 1.55rem;
    line-height: 1.9rem;
    gap: 1rem;
    background-color: var(--colour-white);
    border: 3px solid rgba(45, 24, 16, 0.3);
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.4));
  }

  .food-box p {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  .food-box img {
    width: 90%;
    height: auto;
    aspect-ratio: 1;
    object-fit: contain;
  }

  .food-box button {
    color: white;
    font-size: 1.2rem;
    padding: 0.5rem 0;
    width: 75%;
    border-radius: 25px;
    background-color: var(--colour-green);
    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
    transition: background-color 0.4s ease;
  }

  .food-box button.order-button-red {
    background-color: #b33939;
  }

  .order-confirm {
    position: absolute;
    top: var(--padding-v);
    bottom: var(--padding-v);
    left: var(--padding-h);
    right: var(--padding-h);
    background-color: rgba(0, 0, 0, 0.7);
  }

  .confirm-info {
    font-size: 2rem;
    width: 75%;
    height: auto;
    aspect-ratio: 9.5 / 4;
    gap: 1rem;
    background-color: var(--colour-white);
    border: 3px solid rgba(45, 24, 16, 0.3);
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.4));
  }

  .exit-button {
    font-size: 1.6rem;
    padding: 0.5rem 3rem;
    border-radius: 10px;
    color: var(--colour-light);
    background-color: var(--colour-black);
  }

  .exit-button:disabled {
    background-color: rgba(45, 24, 16, 0.7);
    cursor: not-allowed;
  }
</style>

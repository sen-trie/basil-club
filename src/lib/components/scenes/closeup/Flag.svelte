<script>
  import { blur } from "svelte/transition";
  import { getContext } from "svelte";
  import { onMount } from "svelte";
  import { getScene, foodItems } from "$lib/stores/worldState.svelte.js";

  let { flagScroll = $bindable() } = $props();

  const scene = getScene();
  const image = getContext("images");

  let refs = $state({});
  let categoryList = Object.keys(foodItems);
  let currentHeader = $state(categoryList[0]);
  let orderBox = $state(null);
  let confirmState = $state(false);
  let currentOrder = $state(null);
  let waitTimer = $state(null);
  let waitFinished = $state(false);

  function scrollToCategory(name) {
    refs[name]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeFlag() {
    flagScroll = orderBox.scrollTop;
    scene.closeOverlay();
  }

  onMount(() => {
    orderBox.scrollTop = flagScroll;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          currentHeader = visibleEntries[0].target.dataset.name;
        }
      },
      {
        root: orderBox,
        threshold: [0, 0.1, 0.25],
        rootMargin: "-20px 0px -70% 0px",
      },
    );

    const handleScroll = () => {
      const scrollTop = orderBox.scrollTop;
      const scrollHeight = orderBox.scrollHeight;
      const clientHeight = orderBox.clientHeight;
      const containerTop = orderBox.getBoundingClientRect().top;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        const lastCategory = categoryList[categoryList.length - 1];
        if (currentHeader !== lastCategory) {
          currentHeader = lastCategory;
        }
        return;
      }

      for (const categoryName of categoryList) {
        const element = refs[categoryName];
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top - containerTop;

          if (elementTop <= 100 && elementTop >= -50) {
            if (currentHeader !== categoryName) {
              currentHeader = categoryName;
            }
            break;
          }
        }
      }
    };

    categoryList.forEach((name) => {
      const element = refs[name];
      if (element) observer.observe(element);
    });

    orderBox.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      orderBox.removeEventListener("scroll", handleScroll);
    };
  });

  const orderItem = (item) => {
    if (currentOrder === item) {
      confirmState = item;
      scene.setPlate(confirmState);

      waitTimer = setTimeout(() => {
        waitFinished = true;
        scene.playSound("orderConfirmed");
      }, 1500);
    } else {
      currentOrder = item;
    }
  };

  $effect(() => {
    return () => {
      clearTimeout(waitTimer);
    };
  });
</script>

<div class="flag-wrapper flexbox">
  <div class="flag-tablet order-ui">
    <div class="order-header flexbox">
      <div class="header-left">
        <p class="header-title">Menu</p>
        <nav class="navbar">
          {#each categoryList as cat}
            <button class:selected={currentHeader === cat} onclick={() => scrollToCategory(cat)}>
              {cat}
            </button>
          {/each}
        </nav>
      </div>
      <img class="header-logo" alt="Cafe logo" src={image[`tablet/logo_w.webp`]} />
    </div>
    <div class="order-box scrollable" bind:this={orderBox}>
      {#each categoryList as cat}
        <section class="scrollable">
          <h2 bind:this={refs[cat]} data-name={cat}>{cat}</h2>
          {#each Object.entries(foodItems[cat]) as [item, data]}
            <div class="food-box" class:soldout={data.soldout}>
              <p>{item}</p>
              <img alt="Food item" src={image[`tablet/${data.shortname}.webp`]} />
              <button
                disabled={data.soldout}
                class:order-button-red={currentOrder === item}
                onclick={() => orderItem(item)}
              >
                {data.soldout ? "Sold Out" : currentOrder === item ? "Confirm?" : "Order"}
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
            <button class="exit-button" onclick={closeFlag} aria-label="Put down tablet">
              Return
            </button>
          {/if}
        </div>
      </div>
    {/if}
    <button class="tablet-button" onclick={closeFlag} aria-label="Put down tablet"></button>
  </div>
</div>

<style>
  :root {
    --padding-v: 60px;
    --padding-h: 25px;
  }

  .flag-wrapper {
    position: relative;
    width: 95%;
    height: 97%;
  }

  .flag-tablet {
    position: absolute;
    inset: 0;
    margin: 0 auto;
    height: 100%;
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
    scrollbar-color: var(--colour-med) var(--colour-light);
  }

  .order-box::-webkit-scrollbar-track {
    background: var(--colour-light);
  }

  .order-box::-webkit-scrollbar-thumb {
    background: var(--colour-med);
  }

  .order-box .food-box {
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0.75rem;
    gap: 1rem;
    background-color: var(--colour-white);
    border: 3px solid rgba(45, 24, 16, 0.3);
    filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.3));
  }

  .food-box p {
    font-size: 1.4rem;
    line-height: 1.7rem;
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  .food-box img {
    width: 80%;
    height: auto;
    aspect-ratio: 1;
    object-fit: contain;
    border: 3px solid var(--colour-grey);
    border-radius: 1rem;
  }

  .food-box.soldout {
    color: rgba(0, 0, 0, 0.3);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .food-box.soldout img {
    border: 3px solid var(--colour-white);
    filter: opacity(0.5) grayscale(0.5);
  }

  .food-box button {
    color: white;
    font-size: 1.2rem;
    padding: 0.5rem 0;
    width: 75%;
    border-radius: 25px;
    background-color: var(--colour-green);
    transition: background-color 0.4s ease;
  }

  .food-box button.order-button-red {
    background-color: #b33939;
  }

  .food-box button:disabled {
    cursor: default;
    background-color: rgba(0, 0, 0, 0.3);
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

  @media (max-width: 768px) {
    .order-header {
      padding: 0.5rem 0.75rem;
    }

    .flag-wrapper {
      width: 100%;
      height: 100%;
    }

    .flag-tablet {
      aspect-ratio: auto;
      border: none;
      border-radius: 0;
      padding-top: 0;
      padding-left: 0;
      padding-right: 0;
    }

    .flag-tablet::before {
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-radius: 0;
    }

    .navbar button {
      margin-right: 1rem;
      font-size: 1.2rem;
    }

    .header-logo {
      height: 65px;
      margin: 0;
    }

    .order-box {
      padding: 0 0.5rem 1rem;
    }

    section {
      gap: 0.5rem;
    }

    .order-confirm {
      inset: 0;
    }

    .confirm-info {
      font-size: 1.6rem;
      width: min(400px, 95%);
    }

    .confirm-info > .exit-button {
      font-size: 1.4rem;
    }

    .food-box p {
      font-size: 1.2rem;
      line-height: 1.5rem;
    }
  }
</style>

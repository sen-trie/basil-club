<script>
  import { fade } from "svelte/transition";
  import { getContext } from "svelte";
  import Blackjack from "./Blackjack.svelte";
  import { getScene, findItemByName } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();
  const images = getContext("images");

  let cashierState = $state("order");

  $effect(() => {
    if (cashierState === "processing") {
      setTimeout(() => {
        if (scene.currentState.credits > scene.foodPaid * 100) {
          cashierState = "complete";
          scene.currentState.credits -= scene.foodPaid * 100;
          scene.currentState.foodOrders = [];
        } else {
          cashierState = "incomplete";
          scene.setInteractable("blackjack");
        }
      }, 1500);
    }
  });
</script>

<div class="flag-wrapper">
  <div class="flag-tablet">
    <div class="transition-container">
      {#if cashierState === "order"}
        <div class="flex-v checkout-div">
          <h1>Your orders</h1>
          <div class="order-list">
            {#each Object.entries(scene.currentState.foodOrders.reduce((acc, order) => {
                acc[order] = (acc[order] || 0) + 1;
                return acc;
              }, {})) as [itemName, count]}
              <div class="flexbox order-item">
                <img
                  src={images[`tablet/${findItemByName(itemName).shortname}.webp`]}
                  alt="Food item"
                />
                <h3>{itemName}</h3>
                <h2>{count}</h2>
              </div>
            {/each}
            {#if scene.currentState.foodOrders.length === 0}
              <!-- TODO -->
              <img src="" />
              <p class="empty-order">No orders yet</p>
            {/if}
          </div>
          <h2 class="flexbox">
            Total
            <span>
              ${scene.foodPaid.toFixed(2)}
              ({Math.round(scene.foodPaid * 100)} Credits)
            </span>
          </h2>
          <button
            class="big-button payment-button"
            disabled={scene.foodPaid <= 0}
            onclick={() => (cashierState = "payment")}
          >
            Proceed to payment
          </button>
        </div>
      {/if}

      {#if cashierState === "payment"}
        <div class="flex-v payment-div">
          <h1>Choose payment method</h1>
          <div class="flexbox payment-container">
            <button class="big-button checkout-button flex-v" disabled>
              <img src={images["cash.webp"]} alt="Cash" />
              Cash
              <p>Out of order</p>
            </button>
            <button
              class="big-button checkout-button flex-v"
              onclick={() => (cashierState = "processing")}
            >
              <img src={images["cash.webp"]} alt="Cash" />
              Store credit
            </button>
          </div>
          <button class="big-button" onclick={() => (cashierState = "order")}>Go back</button>
        </div>
      {/if}

      {#if cashierState === "blackjack"}
        <div class="blackjack-div" in:fade={{ duration: 300 }}>
          <Blackjack exitGame={() => (cashierState = "order")} />
        </div>
      {/if}

      {#if ["processing", "incomplete", "complete"].includes(cashierState)}
        <div class="flex-v complete-div" in:fade={{ duration: 300 }}>
          {#if cashierState === "processing"}
            <h1>Processing...</h1>
          {/if}

          {#if cashierState === "incomplete"}
            <img src="" />
            <h1>Payment unsuccesful</h1>
            <h2>Insufficient credits...</h2>
            <button class="big-button" onclick={() => (cashierState = "blackjack")}
              >Obtain credits</button
            >
            <button class="big-button" onclick={() => (cashierState = "order")}>Return</button>
          {/if}

          {#if cashierState === "complete"}
            <img src="" />
            <h1>Payment succesful</h1>
            <h2>Please come back again!</h2>
            <button class="big-button" onclick={scene.closeOverlay}>Return</button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :root {
    --cashier-padding-v: 40px;
    --cashier-padding-h: 30px;
    --checkout-padding-v: 25px;
  }

  .flag-wrapper {
    position: relative;
    width: 95%;
    height: 97%;
  }

  .flag-tablet {
    position: absolute;
    inset: 0;
    bottom: 10%;
    margin: auto;
    max-width: 100%;
    max-height: 90%;
    aspect-ratio: 2 / 3;
    color: black;
    border: 3px solid var(--colour-light);
    border-radius: var(--cashier-padding-h);
    background-color: var(--colour-light);
    padding: var(--cashier-padding-v) var(--cashier-padding-h);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .flag-tablet::before {
    background: none;
    border: var(--cashier-padding-h) solid var(--colour-darkgrey);
    border-top-width: var(--cashier-padding-v);
    border-bottom-width: var(--cashier-padding-v);
    border-radius: calc(var(--cashier-padding-h) - 3px);
    content: "";
    display: block;
    position: absolute;
    pointer-events: none;
    inset: 0;
    z-index: 10;
  }

  .flag-tablet > .transition-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .flag-tablet > .transition-container > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .checkout-div,
  .payment-div,
  .complete-div {
    padding: var(--checkout-padding-v) var(--cashier-padding-h);
    gap: 20px;
  }

  .checkout-div > h2 {
    width: 100%;
    padding: 16px 16px 0;
    border-top: 3px solid var(--colour-dark);
  }

  .big-button {
    background-color: var(--colour-dark);
    color: white;
    width: 100%;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 24px 16px;
    border-radius: 16px;
  }

  .payment-button:disabled {
    opacity: 0.5;
  }

  .order-list {
    overflow-y: auto;
    width: 100%;
    padding: 0 12px;
    flex-grow: 1;
  }

  .order-item {
    width: 100%;
    height: 18%;
    background-color: white;
    margin-bottom: 1rem;
    padding: 12px 18px;
    gap: 8px;
  }

  .order-item h2 {
    margin-right: 6px;
  }

  .order-item h3 {
    margin-left: 6px;
    flex-grow: 1;
  }

  .order-item img {
    height: 90%;
    width: auto;
    aspect-ratio: 1;
    background-color: black;
  }

  .payment-div {
    justify-content: center;
    gap: 20px;
  }

  .payment-container {
    max-width: 100%;
    max-height: 90%;
    aspect-ratio: 2.2;
    gap: 15px;
  }

  .checkout-button {
    position: relative;
    background-color: var(--colour-white);
    border: 4px solid var(--colour-dull-black);
    color: var(--colour-dark);
    overflow: hidden;
    width: 50%;
    height: 100%;
  }

  .checkout-button img {
    width: auto;
    height: 80%;
    object-fit: contain;
    aspect-ratio: 1.2;
    margin-bottom: 0.75rem;
  }

  .checkout-button:disabled {
    border-color: rgba(0, 0, 0, 0.1);
    color: var(--colour-dull-black);
  }

  .checkout-button:disabled img {
    opacity: 0.5;
  }

  .checkout-button p {
    position: absolute;
    top: 0;
    width: 100%;
    background-color: var(--colour-red);
    padding: 2px 0;
    color: var(--colour-white);
  }

  .complete-div {
    background-color: var(--colour-white);
    gap: 10px;
  }

  .complete-div img {
    width: 35%;
    height: auto;
    aspect-ratio: 1;
    margin-bottom: 5px;
    background-color: black;
  }

  .complete-div button:first-of-type {
    margin-top: 20px;
  }

  .blackjack-div {
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
</style>

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
          scene.playSound("paymentSuccess");
        } else {
          cashierState = "incomplete";
          scene.setInteractable("blackjack");
          scene.playSound("paymentUnsucess");
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
          <h1 class="cashier-title">Your orders</h1>
          <div class="order-list scrollable">
            {#each Object.entries(scene.currentState.foodOrders.reduce((acc, order) => {
                acc[order] = (acc[order] || 0) + 1;
                return acc;
              }, {})) as [itemName, count]}
              <div class="flexbox order-item">
                <img
                  src={images[`tablet/${findItemByName(itemName)["shortname"]}.webp`]}
                  alt="Food item"
                />
                <h3>{itemName}</h3>
                <h2>{count}</h2>
              </div>
            {/each}
            {#if scene.currentState.foodOrders.length === 0}
              <img class="img-wrapper" src={images["cashier/empty.webp"]} alt="No orders" />
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
          <h1 class="cashier-title">Choose payment method</h1>
          <div class="flexbox payment-container">
            <button class="big-button checkout-button flex-v" disabled>
              <img src={images["cashier/cash.webp"]} alt="Cash" />
              Cash
              <p>Out of order</p>
            </button>
            <button
              class="big-button checkout-button flex-v"
              onclick={() => (cashierState = "processing")}
            >
              <img src={images["cashier/credit.webp"]} alt="Cash" />
              Credit
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
            <h1 class="cashier-title">Processing...</h1>
          {/if}

          {#if cashierState === "incomplete"}
            <img
              src={images["cashier/incomplete.webp"]}
              class="img-wrapper"
              alt="Insufficient credits"
            />
            <h1 class="cashier-title">Payment unsuccesful</h1>
            <h2>Insufficient credits...</h2>
            <button class="big-button" onclick={() => (cashierState = "blackjack")}
              >Obtain credits</button
            >
            <button class="big-button" onclick={() => (cashierState = "order")}>Return</button>
          {/if}

          {#if cashierState === "complete"}
            <img
              src={images["cashier/complete.webp"]}
              class="img-wrapper"
              alt="Insufficient credits"
            />
            <h1 class="cashier-title">Payment succesful</h1>
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
    --cashier-padding-v: 30px;
    --cashier-padding-h: 20px;
    --checkout-padding-v: 15px;
  }

  .flag-wrapper {
    position: absolute;
    width: 95%;
    height: calc(100% - 80px);
    top: 5px;
  }

  .flag-tablet {
    position: absolute;
    inset: 0;
    margin: auto;
    height: 100%;
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
    border: var(--cashier-padding-h) solid var(--colour-medgrey);
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

  .img-wrapper {
    width: 45%;
    height: auto;
    aspect-ratio: 1;
    margin-bottom: 5px;
    padding: 0.5rem;
    background-color: var(--colour-light);
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
  }

  .order-list img {
    display: block;
    width: 55%;
    background-color: var(--colour-white);
    margin: 1rem auto;
  }

  .order-list p {
    display: block;
    margin: 0 auto;
    width: fit-content;
    font-size: 1.6rem;
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
    width: 100%;
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
    aspect-ratio: 1;
  }

  .checkout-button img {
    height: auto;
    width: 80%;
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

  .complete-div button:first-of-type {
    margin-top: 20px;
  }

  .blackjack-div {
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .flag-wrapper {
      width: 100%;
    }

    .flag-tablet {
      aspect-ratio: auto;
      border: none;
      border-radius: 0;
      padding: 0;
      margin-bottom: 1rem;
    }

    .flag-tablet::before {
      border: 0;
      border-radius: 0;
    }

    .checkout-div,
    .payment-div,
    .complete-div {
      padding: calc(var(--checkout-padding-v) / 2) calc(var(--cashier-padding-h) / 2);
      padding-top: 20px;
      gap: 15px;
    }

    .blackjack-div {
      padding-top: 20px;
    }

    .cashier-title {
      font-size: 1.6rem;
    }

    .big-button {
      padding: 12px 8px;
    }

    .checkout-div > h2 {
      padding: 4px;
      padding-top: 16px;
      padding-bottom: 0;
    }

    .payment-container {
      gap: 5px;
    }

    .order-list {
      padding: 0;
    }

    .order-list .order-item {
      padding: 6px 9px;
      margin-bottom: 0.5rem;
    }
  }
</style>

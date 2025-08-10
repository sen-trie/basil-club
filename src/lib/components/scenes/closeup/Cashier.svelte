<script>
  import { fade } from "svelte/transition";
  import Blackjack from "./Blackjack.svelte";

  let cashierState = $state("order");

  $effect(() => {
    if (cashierState === "processing") {
      setTimeout(() => {
        cashierState = "incomplete";
      }, 1500);
    }
  });
</script>

<div class="flag-wrapper">
  <div class="flag-tablet">
    <div class="transition-container">
      {#if cashierState === "order"}
        <div class="flex-v checkout-div" transition:fade={{ duration: 300 }}>
          <h1>Your Orders</h1>
          <div class="order-list">
            <div class="flexbox order-item">
              <img src="" />
              <h3>Lemon Basque</h3>
              <h2>1</h2>
            </div>
            <div class="flexbox order-item">
              <img src="" />
              <h3>Lemon Basque</h3>
              <h2>1</h2>
            </div>
            <div class="flexbox order-item">
              <img src="" />
              <h3>Lemon Basque</h3>
              <h2>1</h2>
            </div>
            <div class="flexbox order-item">
              <img src="" />
              <h3>Lemon Basque Lemon Basque Lemon Basque</h3>
              <h2>1</h2>
            </div>
            <div class="flexbox order-item">
              <img src="" />
              <h3>Lemon Basque</h3>
              <h2>1</h2>
            </div>
          </div>
          <h2 class="flexbox">Total<span>$ 1</span></h2>
          <button class="big-button" onclick={() => (cashierState = "payment")}>
            Proceed to payment
          </button>
        </div>
      {/if}

      {#if cashierState === "payment"}
        <div class="flex-v payment-div" transition:fade={{ duration: 300 }}>
          <div class="flexbox payment-container">
            <button class="big-button checkout-button flex-v" disabled>
              <img src="" />
              Cash
            </button>
            <button
              class="big-button checkout-button flex-v"
              onclick={() => (cashierState = "processing")}
            >
              <img src="" />
              Store credit
            </button>
          </div>
          <button class="big-button" onclick={() => (cashierState = "order")}>Go back</button>
        </div>
      {/if}

      {#if cashierState === "blackjack"}
        <div class="blackjack-div" transition:fade={{ duration: 300 }}>
          <Blackjack exitGame={() => (cashierState = "order")} />
        </div>
      {/if}

      {#if ["processing", "incomplete", "complete"].includes(cashierState)}
        <div class="flex-v complete-div" transition:fade={{ duration: 300 }}>
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
            <button class="big-button" onclick={() => (cashierState = "order")}>Return</button>
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
    padding: 0 16px;
  }

  .big-button {
    background-color: lightblue;
    width: 100%;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 24px 16px;
    border-radius: 16px;
  }

  .order-list {
    overflow-y: auto;
    width: 100%;
    padding: 0 16px;
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
    width: 100%;
    height: auto;
    aspect-ratio: 2.2;
    gap: 15px;
  }

  .checkout-button {
    width: 50%;
    height: 100%;
  }

  .checkout-button img {
    width: auto;
    height: 80%;
    aspect-ratio: 1;
    margin-bottom: 1rem;
    background-color: wheat;
  }

  .complete-div {
    background-color: white;
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

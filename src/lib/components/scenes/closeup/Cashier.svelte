<script>
  import Blackjack from "./Blackjack.svelte";
</script>

<div class="flag-wrapper">
  <div class="flag-tablet">
    <Blackjack />
  </div>
</div>

<style>
  :root {
    --cashier-padding-v: 40px;
    --cashier-padding-h: 30px;
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
  }
</style>

<script>
  let { progressLessThanOne, progressWidth, startPage } = $props();
  import { dev } from "$app/environment";
  import { isMobile, getScene } from "$lib/stores/worldState.svelte.js";

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  let currentProgress = $state(0);
  $effect(() => {
    if (progressWidth > 0) {
      currentProgress = currentProgress > progressWidth ? currentProgress : progressWidth;
    }
  });
</script>

{#if progressLessThanOne}
  <p class="loading">Loading...<br />{Math.round(currentProgress)}%</p>
{:else}
  <button onclick={startPage}>
    <p>Start</p>
  </button>
  {#if dev}
    {#if $isMobile}
      MOBILE
    {:else}
      DESKTOP
    {/if}
  {/if}

  {#if isIOS}
    <p class="ios-warning">
      iOS Only: <br /> To hear sounds, please turn off "silent mode" on your device
    </p>
  {/if}
{/if}

<style>
  .loading {
    text-align: center;
    font-size: 1.8rem;
    line-height: 2rem;
    margin-bottom: 1rem;
    color: #362017;
  }

  button {
    background-color: #362017;
    padding: 1rem 4rem;
    border-radius: 1rem;
  }

  p {
    font-size: 2rem;
    font-weight: 700;
    color: #ebded9;
  }

  .ios-warning {
    position: absolute;
    top: calc(50% + 4rem);
    translate: 0 -50%;
    max-width: 250px;
    text-align: center;
    font-size: 1rem;
    color: var(--colour-black);
  }
</style>

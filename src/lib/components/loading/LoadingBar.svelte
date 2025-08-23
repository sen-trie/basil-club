<script>
  let { progressLessThanOne, progressWidth, startPage } = $props();
  import { dev } from "$app/environment";
  import { isMobile } from "$lib/stores/worldState.svelte.js";

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
      DESKTOP{/if}
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
</style>

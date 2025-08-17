<script>
  let { progressLessThanOne, progressWidth, startPage } = $props();
</script>

{#if progressLessThanOne}
  <p class="loading">Loading...<br />{Math.round(progressWidth)}%</p>
{:else}
  <button onclick={startPage}>
    <p>Start</p>
  </button>
{/if}

<style>
  .loading {
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

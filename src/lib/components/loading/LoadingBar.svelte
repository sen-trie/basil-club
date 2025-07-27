<script>
  let { progressWidth, progressLessThanOne, startPage } = $props();
</script>

{#if progressLessThanOne}
  <p class="loading">Loading</p>
  <div class="bar-wrapper">
    <div class="bar" style="width: {progressWidth}%"></div>
  </div>
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

  .bar-wrapper {
    height: 1rem;
    width: max(450px, 50%);
    border: 2px solid #362017;
    border-radius: 0.5rem;
  }

  .bar {
    height: 100%;
    background-color: #362017;
  }

  button {
    background-color: #362017;
    padding: 1rem 4rem;
    border-radius: 1rem;
  }

  p {
    font-size: 2rem;
    color: #ebded9;
  }
</style>

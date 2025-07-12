<script>
  import Pane from "./overlay/Pane.svelte";
  import Audio from "./overlay/Audio.svelte";

  let pageStarted = $state(false);
  let audioEl = $state(null);

  $effect(() => {
    if (pageStarted) {
      audioEl.playBGM;
    }
  });
</script>

<div class="abs overlay-screen">
  <!-- <Audio bind:this={audioEl} /> -->
  <Pane />
</div>

<!-- {#if !pageStarted}
  <div class="abs intro-screen">
    <button
      onclick={() => {
        pageStarted = true;
      }}>START</button
    >
  </div>
{/if} -->

<style>
  .abs {
    position: absolute;
    z-index: 10;
  }

  .abs > * {
    pointer-events: all;
  }

  .overlay-screen {
  }

  .intro-screen {
  }
</style>

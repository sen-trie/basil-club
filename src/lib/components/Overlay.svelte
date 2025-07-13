<script>
  import Pane from "./overlay/Pane.svelte";
  import Closeup from "./Closeup.svelte";
  import Audio from "./overlay/Audio.svelte";

  let pageStarted = $state(false);
  let audioEl = $state(null);

  $effect(() => {
    if (pageStarted) {
      audioEl.playBGM;
    }
  });
</script>

<div class="overlay-screen">
  <!-- <Audio bind:this={audioEl} /> -->
  <Pane />
</div>
<Closeup />

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
  .overlay-screen {
    position: absolute;
    display: flex;
    z-index: 10;
    overflow: hidden;
  }
</style>

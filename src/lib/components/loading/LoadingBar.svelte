<script>
  let { progressLessThanOne, progressWidth, startPage } = $props();
  import { dev } from "$app/environment";
  import { isMobile, getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();

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

  <form>
    <fieldset>
      <legend>Select a maple tree:</legend>

      <div>
        <input
          type="radio"
          name="drone"
          id="huey"
          value="control"
          checked
          bind:group={scene.currentState.dev}
        />
        <label for="huey">Control</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie2"
          value="opaq"
          bind:group={scene.currentState.dev}
        />
        <label for="louie2">Opaque</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="dewey"
          value="basic"
          bind:group={scene.currentState.dev}
        />
        <label for="dewey">Mesh Basic</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie"
          value="trans"
          bind:group={scene.currentState.dev}
        />
        <label for="louie">Transparency</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie330122"
          value="transAlpha"
          bind:group={scene.currentState.dev}
        />
        <label for="louie330122">Transparency Alpha</label>
      </div>
    </fieldset>
  </form>
  <form>
    <fieldset>
      <legend>Select a fire:</legend>

      <div>
        <input
          type="radio"
          name="drone"
          id="huey3"
          value="control"
          checked
          bind:group={scene.currentState.devFire}
        />
        <label for="huey3">Control</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie23"
          value="opaq"
          bind:group={scene.currentState.devFire}
        />
        <label for="louie23">Opaque</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="dewey33"
          value="basic"
          bind:group={scene.currentState.devFire}
        />
        <label for="dewey33">Mesh Basic</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie33"
          value="trans"
          bind:group={scene.currentState.devFire}
        />
        <label for="louie33">Transparency</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie33012"
          value="transAlpha"
          bind:group={scene.currentState.devFire}
        />
        <label for="louie33012">Transparency Alpha</label>
      </div>
    </fieldset>
  </form>

  <form>
    <fieldset>
      <legend>Select a bush:</legend>

      <div>
        <input
          type="radio"
          name="drone"
          id="huey30"
          value="control"
          checked
          bind:group={scene.currentState.devBush}
        />
        <label for="huey30">Control</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie230"
          value="opaq"
          bind:group={scene.currentState.devBush}
        />
        <label for="louie230">Opaque</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="dewey330"
          value="basic"
          bind:group={scene.currentState.devBush}
        />
        <label for="dewey330">Mesh Basic</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie330"
          value="trans"
          bind:group={scene.currentState.devBush}
        />
        <label for="louie330">Transparency</label>
      </div>

      <div>
        <input
          type="radio"
          name="drone"
          id="louie3301"
          value="transAlpha"
          bind:group={scene.currentState.devBush}
        />
        <label for="louie3301">Transparency Alpha</label>
      </div>
    </fieldset>
  </form>
{/if}

<style>
  fieldset {
    margin-top: 1rem;
    font-size: 1rem;
  }

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

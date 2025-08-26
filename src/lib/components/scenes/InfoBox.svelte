<script>
  import Cross from "$lib/assets/ui/cross.svelte";
  import Cup from "$lib/assets/ui/cup.svelte";
  import { fade, scale } from "svelte/transition";
  import { getContext } from "svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();
  const images = getContext("images");

  let { infoOpen, closeInfo } = $props();
</script>

{#snippet sectionBreak(text, initialbreak = true)}
  {#if initialbreak}
    <br />
  {/if}
  <br />
  <hr />
  <br />
  <em>{text}</em>
  <br /><br />
{/snippet}

{#if infoOpen}
  <dialog transition:fade={{ duration: 200 }} class="info-screen flex-v" onclick={closeInfo}>
    <div
      tabindex="-1"
      aria-hidden="true"
      transition:scale={{ delay: 0, duration: 400, start: 1.1, opacity: 0 }}
      class:f-toilet={scene.currentState.scene === "fToilet"}
      class:m-toilet={scene.currentState.scene === "mToilet"}
      class="info-wrapper"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="info-div flex-v">
        <div class="info-banner">
          <img class="info-img" src={images["banner.webp"]} alt="info banner" />
          <a
            class="overlay-element exit-link"
            href="https://basil-main.vercel.app/"
            target="_blank"
          >
            <Cup />Visit main site!
          </a>
        </div>
        <div class="scrollable info-content">
          Welcome to <strong>Basil Club</strong>! <br /><br /> Take your time to explore the café -
          there are many interactables scattered about. You can get hints by clicking the number
          counter at the <u>top</u> of the screen. I hope you enjoy your stay!
          {@render sectionBreak("What is this?")}
          This virtual experience is a homage to my stay in Canada. It is where I took up baking for
          the first time and found that the process came naturally to me. Thus, many of the objects you
          see here pay tribute to my experiences there.
          <br /><br />
          This project is my first foray into 3D web development and developing a modelling workflow
          in Blender. I've learnt quite a bit about topology (it was a trial by fire...) and it's also
          my first time working with Three.js.
          <br /><br />
          Made in
          <a href="https://threlte.xyz/" target="_blank">Threlte v8</a>

          {@render sectionBreak("If you liked this, check out my other works!")}
          <div class="contact-grid">
            <a class="overlay-element exit-link" href="https://github.com/sen-trie" target="_blank">
              <img class="info-img" src={images["dp.webp"]} alt="info banner" />
              Github <br />Profile
            </a>
            <a
              class="overlay-element exit-link"
              href="https://sen-trie.github.io/portfolio/"
              target="_blank"
            >
              <img class="info-img" src={images["port.webp"]} alt="info banner" />
              Portfolio <br />Website
            </a>
          </div>
          {@render sectionBreak("Credits", false)}
          <a
            href="https://sketchfab.com/3d-models/old-microphone-812ed8c6fee44602a376159f7990a765"
            target="_blank"
            >Old Microphone
          </a>
          <br />
          <a
            href="https://sketchfab.com/3d-models/gibson-lespaul-7a563eb268754016b005a8a79fec35bf"
            target="_blank"
            >Gibson Les Paul
          </a>
          <br />
          <a
            href="https://sketchfab.com/3d-models/teddy-bears-e84b12b4ac20402aaf4d40f2219cd0e2"
            target="_blank"
            >Teddy Bears
          </a>
          <br />
          <a
            href="https://sketchfab.com/3d-models/bucket-hat-293440f8d77549b8a99d0ca6ca8ba614"
            target="_blank"
            >Bucket Hat
          </a>
          <br />
          <a href="https://freesound.org/people/mokasza/sounds/810323/" target="_blank"
            >Bell SFX
          </a>
          <br />
          <a href="https://freesound.org/people/juskiddink/sounds/74893/" target="_blank"
            >Bell Jingle
          </a>
        </div>
      </div>
      <button class="overlay-element out-button" onclick={closeInfo}>
        <Cross />
      </button>
    </div>
  </dialog>
{/if}

<style>
  a:not(.overlay-element),
  a:visited:not(.overlay-element) {
    color: var(--colour-med);
  }

  .info-screen {
    position: absolute;
    width: 100%;
    height: 100%;
    color: var(--colour-white);
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.8);
  }

  .info-wrapper {
    position: absolute;
    width: min(750px, 95%);
    height: 85%;
  }

  .info-div {
    height: 100%;
    overflow: hidden;
    gap: 1rem;
    color: var(--colour-dark);
    background-color: var(--colour-white);
    border: 8px solid var(--c1);
    border-radius: 20px;
    justify-content: space-between;
    padding-bottom: 1rem;
    transition: border 3.8s ease;
  }

  .info-banner {
    position: relative;
    width: 100%;
    height: 200px;
    border-bottom: 8px solid var(--c1);
  }

  .info-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .info-banner a {
    position: absolute;
    left: 50%;
    translate: -50% calc(50% + 4px);
    bottom: 0;
  }

  .out-button {
    position: absolute;
    top: 0;
    right: 0;
    translate: 25% -25%;
  }

  .info-content {
    font-size: 1.4rem;
    margin-top: 2.5rem;
    padding: 0 1rem 0.5rem;
    width: calc(100% - 2rem);
    overflow-y: auto;
    flex-grow: 1;
  }

  .exit-link {
    text-decoration: none;
    padding: 0.5rem 1rem;
    width: fit-content;
    border-width: 4px;
    border-radius: 15px;
    font-size: 1.6rem;
    cursor: pointer;
    margin: 0 auto;
  }

  .contact-grid {
    margin-top: -8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 1rem;
    gap: 2rem;
    text-align: center;
  }

  .contact-grid .exit-link {
    width: 100%;
    height: auto;
    font-size: 1.4rem;
  }

  .contact-grid img {
    width: 90px;
    aspect-ratio: 1;
    object-fit: cover;
    margin-right: 1.5rem;
    background-color: var(--colour-dull-black);
  }

  .info-div,
  .info-banner {
    --c0: var(--colour-black);
    --c1: var(--colour-dark);
  }

  .f-toilet .info-div,
  .f-toilet .info-banner {
    --c0: var(--ftoilet-dark);
    --c1: var(--ftoilet-light);
  }

  .m-toilet .info-div,
  .m-toilet .info-banner {
    --c0: var(--mtoilet-dark);
    --c1: var(--mtoilet-light);
  }

  @media (max-width: 768px) {
    .info-wrapper {
      width: 100%;
      height: 100%;
    }

    .info-wrapper .out-button {
      translate: 0;
      top: 5px;
      right: 5px;
      width: 60px;
      height: 60px;
    }

    .info-div {
      border: 0;
      border-radius: 0;
    }

    .info-div .exit-link {
      font-size: 1.3rem;
      white-space: nowrap;
    }

    .info-content {
      padding: 0 0.5rem 0.5rem 0;
      width: calc(100% - 1rem);
      font-size: 1.2rem;
      overflow-x: hidden;
    }

    .contact-grid {
      width: 100%;
      padding: 0;
      gap: 0.5rem;
    }

    .contact-grid img {
      width: 50px;
      margin-right: 0.5rem;
    }

    .contact-grid .overlay-element:hover {
      transform: none;
    }
  }
</style>

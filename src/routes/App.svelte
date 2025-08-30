<script>
  import Scene from "$lib/components/Scene.svelte";
  import { Canvas } from "@threlte/core";
  import { useProgress } from "@threlte/extras";
  import { Studio, Project } from "@threlte/theatre";
  import { getContext, onMount, onDestroy } from "svelte";
  import { dev } from "$app/environment";
  import { Tween } from "svelte/motion";
  import { fromStore } from "svelte/store";
  import Loading from "$lib/components/loading/LoadingBar.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import projectState from "$lib/assets/configState.json";
  import Audio from "$lib/components/Audio.svelte";
  import { audioRef } from "$lib/stores/worldState.svelte.js";
  import { WebGLRenderer } from "three";

  let pageStarted = $state(false);

  const { progress } = useProgress();
  const p = fromStore(progress);
  const tweenedProgress = Tween.of(() => p.current, { duration: 0 });
  const progressLessThanOne = $derived(tweenedProgress.current < 1);
  const progressWidth = $derived(100 * tweenedProgress.current);

  import { cubicInOut } from "svelte/easing";
  function clipReverse(_node, { duration = 1000 } = {}) {
    return {
      duration,
      easing: cubicInOut,
      css: (_t, u) => {
        const clip = `inset(${u * 50}% ${u * 50}% calc(${u}*(50% + 4rem)) ${u * 50}% round ${u * 50}%)`;
        // const clip = `circle(${t * 100}% at 50% calc(50% - 4rem));`;
        const scale = 1 - 0.1 * u;
        return `
          clip-path: ${clip};
          transform: scale(${scale});
        `;
      },
    };
  }

  let audioEl = $state(null);
  const images = getContext("images");

  $effect(() => {
    if (pageStarted) {
      audioEl.playBGM();
    }
  });

  onMount(() => {
    audioRef.set(audioEl);
  });

  onDestroy(() => {
    audioRef.set(null);
  });
</script>

{#if !pageStarted}
  <div out:clipReverse={{ duration: 1200 }} class="wrapper">
    <Loading {progressLessThanOne} {progressWidth} startPage={() => (pageStarted = true)} />
  </div>
{:else}
  <Overlay />
{/if}

<Audio bind:this={audioEl} {pageStarted} />
<Studio enabled={false && dev} />

<div class="main">
  <Canvas
    renderMode="on-demand"
    createRenderer={(canvas) => {
      const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(1);
      return renderer;
    }}
  >
    <Project name="Basil Club" config={{ state: projectState }}>
      <Scene />
    </Project>
  </Canvas>
  <img class="loading-img" src={images["loading.webp"]} alt="" />
</div>

<style>
  div.main {
    position: relative;
    height: 100%;
    background-color: #110f0f;
  }

  .loading-img {
    position: absolute;
    object-fit: contain;
    width: min(400px, 80%);
    height: auto;
    top: 50%;
    left: 50%;
    translate: -50% -65%;
    pointer-events: none;
  }

  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ebded9;
    padding-bottom: 4rem;
  }
</style>

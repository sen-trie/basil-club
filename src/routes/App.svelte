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
  import * as THREE from "three";

  const image = getContext("images");

  const { progress } = useProgress();
  const p = fromStore(progress);
  const tweenedProgress = Tween.of(() => p.current, { duration: 100 });
  const progressWidth = $derived(100 * tweenedProgress.current);
  const progressLessThanOne = $derived(tweenedProgress.current < 1);

  let pageStarted = $state(false);

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

{#if !dev && !pageStarted}
  <div out:clipReverse={{ duration: 1200 }} class="wrapper">
    <Loading {progressLessThanOne} {progressWidth} startPage={() => (pageStarted = true)} />
  </div>
{:else}
  <Overlay />
{/if}

<Audio bind:this={audioEl} isMuted={false} />
<Studio enabled={false && dev} />

<div class="main">
  <Canvas
    renderMode="on-demand"
    createRenderer={(canvas) => new THREE.WebGLRenderer({ canvas, antialias: false })}
  >
    <Project name="Basil Club" config={{ state: projectState }}>
      <Scene />
    </Project>
  </Canvas>
  <img class="loading-img" src={image["loading.webp"]} alt="" />
</div>

<style>
  div.main {
    position: relative;
    height: 100%;
    background-color: #1f100a;
  }

  .loading-img {
    position: absolute;
    object-fit: contain;
    width: min(300px, 80%);
    height: auto;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: 1;
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

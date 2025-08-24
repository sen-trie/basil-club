<script>
  import { getScene, isMobile } from "$lib/stores/worldState.svelte.js";
  import { Vector3 } from "three";
  import { onMount } from "svelte";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, interactivity, transitions } from "@threlte/extras";
  import { SMAAPreset, EdgeDetectionMode } from "postprocessing";
  import { EffectComposer } from "threlte-postprocessing";
  import { SMAAEffect, HueSaturationEffect } from "threlte-postprocessing/effects";
  import HudScene from "./scenes/HudScene.svelte";
  import POVScene from "./scenes/POVScene.svelte";
  import { fly } from "$lib/components/transitions.js";
  import Cafe from "$lib/components/models/cafe-rc5-ktx-transformed.svelte";
  import MToilet from "$lib/components/models/m-toilet-ktx-transformed.svelte";
  import FToilet from "$lib/components/models/f-toilet-ktx-transformed.svelte";
  import {
    minPolarAngle,
    maxPolarAngle,
    minAzimuthAngle,
    maxAzimuthAngle,
    enableDamping,
    enablePan,
    defaultZoom,
    defaultView,
  } from "./SceneConfig.js";

  interactivity();
  transitions();

  const scene = getScene();

  let cameraRef = $state(null);
  let cafeRef = $state(null);
  let controlsRef = $state(null);

  const minPanBase = new Vector3(-2, -2, -2);
  const maxPanBase = new Vector3(2, 2, 2);
  useTask((_delta) => {
    if (!controlsRef) return;

    const scaleFactor = cameraRef.zoom / defaultZoom;
    const target = controlsRef.target;
    const minPan = minPanBase.clone().multiplyScalar(scaleFactor);
    const maxPan = maxPanBase.clone().multiplyScalar(scaleFactor);

    target.clamp(minPan, maxPan);
  });

  let browserZoomLevel = $state(1);
  let zoom = $derived(defaultZoom / browserZoomLevel);
  let minZoom = $derived((defaultZoom * 0.8) / browserZoomLevel);
  let maxZoom = $derived((defaultZoom * 5) / browserZoomLevel);

  function updateZoomLevel() {
    const nativeWidth = 1080;
    let scaleFactor;
    if (window.innerWidth < 576) {
      scaleFactor = 0.2;
    } else if (window.innerWidth < 576) {
      scaleFactor = 0.3;
    } else if (window.innerWidth < 768) {
      scaleFactor = 0.5;
    } else if (window.innerWidth < 992) {
      scaleFactor = 0.8;
    } else if (window.innerWidth < 1080) {
      scaleFactor = 1;
    } else if (window.innerWidth < 1400) {
      scaleFactor = 1.4;
    } else if (window.innerWidth < 2400) {
      scaleFactor = 1.8;
    } else {
      scaleFactor = 4;
    }

    browserZoomLevel = window.innerWidth / nativeWidth / scaleFactor;
  }

  onMount(() => {
    updateZoomLevel();
    window.addEventListener("resize", updateZoomLevel);

    return () => window.removeEventListener("resize", updateZoomLevel);
  });
</script>

{#snippet postProcess()}
  <EffectComposer>
    <SMAAEffect
      preset={$isMobile ? SMAAPreset.LOW : SMAAPreset.HIGH}
      edgeDetectionMode={EdgeDetectionMode.COLOR}
    />
    <HueSaturationEffect saturation={-0.1} />
  </EffectComposer>
{/snippet}

<T.OrthographicCamera
  makeDefault={!scene.currentState.povCamera}
  position={[20, 0, 20]}
  view={{ ...defaultView }}
  bind:ref={cameraRef}
  {zoom}
>
  <OrbitControls
    enabled={!scene.currentState.hudControls}
    bind:ref={controlsRef}
    {minPolarAngle}
    {maxPolarAngle}
    {minAzimuthAngle}
    {maxAzimuthAngle}
    {enableDamping}
    {enablePan}
    {minZoom}
    {maxZoom}
  ></OrbitControls>
</T.OrthographicCamera>

<POVScene />
{#key scene.currentState.hudControls}
  <HudScene {browserZoomLevel} />
{/key}

{#if scene.currentState.scene === "cafe"}
  <Cafe visible={true} bind:ref={cafeRef} transition={fly({ x: 0, y: 50, z: 0 })} />
{:else if scene.currentState.scene === "mToilet"}
  <MToilet transition={fly({ x: 0, y: 50, z: 0 })} />
{:else if scene.currentState.scene === "fToilet"}
  <FToilet transition={fly({ x: 0, y: 50, z: 0 })} />
{/if}

{#key scene.currentState.povCamera}
  {@render postProcess()}
{/key}

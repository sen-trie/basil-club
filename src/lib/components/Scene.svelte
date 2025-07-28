<script>
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import { Vector3 } from "three";
  import { onMount } from "svelte";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, interactivity, transitions } from "@threlte/extras";
  import HudScene from "./scenes/HudScene.svelte";
  import POVScene from "./scenes/POVScene.svelte";
  import { fly } from "$lib/components/transitions.js";
  import Cafe from "$lib/components/models/cafe.svelte";
  import MToilet from "$lib/components/models/m-toilet.svelte";
  import FToilet from "$lib/components/models/f-toilet.svelte";
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

  let browserZoomLevel = $state(1); // Initialize with a default value (100% zoom)

  function updateZoomLevel() {
    browserZoomLevel = window.devicePixelRatio;
  }

  onMount(() => {
    updateZoomLevel();
    window.addEventListener("resize", updateZoomLevel);

    return () => window.removeEventListener("resize", updateZoomLevel);
  });
</script>

<T.OrthographicCamera
  makeDefault={!scene.currentState.povCamera}
  position={[20, 0, 20]}
  zoom={defaultZoom / browserZoomLevel}
  view={{ ...defaultView }}
  bind:ref={cameraRef}
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
    minZoom={(defaultZoom * 0.9) / browserZoomLevel}
    maxZoom={(defaultZoom * 5) / browserZoomLevel}
  />
</T.OrthographicCamera>

<POVScene />
<HudScene {browserZoomLevel} />

{#if scene.currentState.scene === "cafe"}
  <Cafe
    visible={true}
    bind:ref={cafeRef}
    transition={fly({ x: 0, y: 50, z: 0 })}
  />
{:else if scene.currentState.scene === "mToilet"}
  <MToilet transition={fly({ x: 0, y: 50, z: 0 })} />
{:else if scene.currentState.scene === "fToilet"}
  <FToilet transition={fly({ x: 0, y: 50, z: 0 })} />
{/if}

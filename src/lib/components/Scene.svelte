<script>
  import {
    showHud as showHudStore,
    hideHud as hideHudStore,
    showOverlay,
  } from "$lib/stores/sceneControls";
  import { Vector3 } from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, interactivity, transitions } from "@threlte/extras";
  import HudScene from "./scenes/HudScene.svelte";
  import POVScene from "./scenes/POVScene.svelte";
  import { fly } from "$lib/components/transitions.js";
  import Cafe from "$lib/components/models/cafe.svelte";
  import MToilet from "$lib/components/models/m-toilet.svelte";
  import FToilet from "$lib/components/models/f-toilet.svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";
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
  let hudControlsEnabled = $state(false);
  let povControlsEnabled = $state(false);

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

  let changeOverlay = () => {};
  showOverlay.subscribe((fn) => {
    changeOverlay = fn;
  });

  const showHud = (_state) => {
    if (hudControlsEnabled || scene.currentState.povCamera) return;
    hudControlsEnabled = !hudControlsEnabled;
    changeOverlay("hud");
    scene.setInteractable("earl-street");
  };
  showHudStore.set(showHud);

  const hideHud = () => {
    hudControlsEnabled = false;
  };
  hideHudStore.set(hideHud);
</script>

<T.OrthographicCamera
  makeDefault={!scene.currentState.povCamera}
  position={[20, 0, 20]}
  zoom={defaultZoom}
  view={{ ...defaultView }}
  bind:ref={cameraRef}
>
  <OrbitControls
    enabled={!hudControlsEnabled}
    bind:ref={controlsRef}
    {minPolarAngle}
    {maxPolarAngle}
    {minAzimuthAngle}
    {maxAzimuthAngle}
    {enableDamping}
    {enablePan}
    minZoom={defaultZoom * 0.9}
    maxZoom={defaultZoom * 5}
  />
</T.OrthographicCamera>

<POVScene />
<HudScene {hudControlsEnabled} />

{#if scene.currentState.scene === "cafe"}
  <Cafe
    visible={true}
    {hudControlsEnabled}
    bind:ref={cafeRef}
    transition={fly({ x: 0, y: 50, z: 0 })}
  />
{:else if scene.currentState.scene === "mToilet"}
  <MToilet transition={fly({ x: 0, y: 50, z: 0 })} />
{:else if scene.currentState.scene === "fToilet"}
  <FToilet transition={fly({ x: 0, y: 50, z: 0 })} />
{/if}

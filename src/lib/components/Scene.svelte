<script>
  import {
    changeFloor as changeFloorStore,
    showHud as showHudStore,
    hideHud as hideHudStore,
    showOverlay,
  } from "$lib/stores/sceneControls";
  import { Spring } from "svelte/motion";
  import { T, useThrelte, useTask } from "@threlte/core";
  import {
    HUD,
    OrbitControls,
    CameraControls,
    interactivity,
  } from "@threlte/extras";
  import { Vector3 } from "three";
  import Cafe from "$lib/components/models/cafe.svelte";
  import EarlStreet from "$lib/components/models/earl-street.svelte";
  import Cat from "$lib/components/models/cat.svelte";

  const { invalidate } = useThrelte();
  interactivity();

  let cameraRef = $state(null);
  let cafeRef = $state(null);
  let catRef = $state(null);
  let controlsRef = $state(null);
  let hudControlsEnabled = $state(false);

  let cafeStats = new Spring({ y: 0 });
  let currentFloor = $state(0);
  let cafeTop = $derived(
    cafeRef.children.find((child) => child.name === "Top")
  );
  let cafeBot = $derived(
    cafeRef.children.find((child) => child.name === "Bottom")
  );

  const minPolarAngle = 1.23;
  const maxPolarAngle = minPolarAngle;
  const minAzimuthAngle = 0.2;
  const maxAzimuthAngle = Math.PI / 2 - minAzimuthAngle;
  const enableDamping = true;
  const enablePan = true;
  const defaultZoom = 50;

  const defaultView = {
    enabled: true,
    fullWidth: 2000,
    fullHeight: 1000,
    offsetX: 100,
    offsetY: -150,
    width: 2000,
    height: 1000,
  };

  const changeFloor = (state) => {
    if (hudControlsEnabled) return;

    const displacementY = 2;
    const cafeTopFull = 7.34;
    const cafeTopHalf = 2.71;
    const cafeBotFull = 1.47;
    const nullZone = -99;

    cafeTop.position.set(cafeTop.position.x, cafeTopFull, cafeTop.position.z);
    cafeBot.position.set(cafeBot.position.x, cafeBotFull, cafeBot.position.z);

    cafeTop.visible = true;
    cafeBot.visible = true;
    cafeStats.target = { ...cafeStats.current, y: 0 };

    if (state === 1) {
      cafeBot.visible = false;
      cafeStats.target = { ...cafeStats.current, y: displacementY };
      cafeTop.position.set(cafeTop.position.x, cafeTopHalf, cafeTop.position.z);
      cafeBot.position.set(cafeBot.position.x, nullZone, cafeBot.position.z);
    } else if (state === 2) {
      cafeTop.visible = false;
      cafeStats.target = { ...cafeStats.current, y: displacementY };
      cafeTop.position.set(cafeTop.position.x, nullZone, cafeTop.position.z);
    }

    invalidate();
    currentFloor = state;
  };
  changeFloorStore.set(changeFloor);

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
    hudControlsEnabled = !hudControlsEnabled;
    changeOverlay("none");
  };
  showHudStore.set(showHud);

  const hideHud = () => {
    hudControlsEnabled = false;
  };
  hideHudStore.set(hideHud);
</script>

<T.OrthographicCamera
  makeDefault
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
    minZoom={defaultZoom * 0.8}
    maxZoom={defaultZoom * 4}
  />
</T.OrthographicCamera>

<T.PerspectiveCamera
  makeDefault={false}
  fov={40}
  position={[5.7, 0.4, -1.24]}
  rotation={[-0.1, Math.PI / 2, 0.1]}
>
  <CameraControls
    mouseButtons={{
      left: 0, // disables rotate
      wheel: 0, // disables zoom
      middle: 0,
      right: 0,
    }}
    touches={{
      one: 0, // disables rotate
      two: 0, // disables zoom
    }}
    oncreate={(ref) => {
      ref.setTarget(0, -0.4, -1.2);
    }}
  />
</T.PerspectiveCamera>

<HUD visible={hudControlsEnabled}>
  <T.OrthographicCamera makeDefault position={[12, 4, 10]} zoom={270}>
    <OrbitControls
      enabled={hudControlsEnabled}
      minZoom={270 * 0.75}
      maxZoom={270 * 1.25}
      enablePan={false}
    />
  </T.OrthographicCamera>
  <EarlStreet scale={1 / 0.9} rotation={[0, 0, 0]} />
</HUD>
<Cafe
  visible={true}
  {hudControlsEnabled}
  bind:ref={cafeRef}
  position.y={cafeStats.current.y}
>
  <Cat
    scale={0.4}
    position={[3.4, 0, -1.23]}
    rotation={[0, Math.PI / 2 - 0.05, 0]}
    bind:ref={catRef}
  />
</Cafe>

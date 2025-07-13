<script>
  import { changeFloor as changeFloorStore } from "$lib/stores/sceneControls";
  import { Spring } from "svelte/motion";
  import { T, useThrelte, useTask } from "@threlte/core";
  import { HUD, OrbitControls, interactivity } from "@threlte/extras";
  import { Vector3 } from "three";
  import Cafe from "$lib/components/models/cafe.svelte";

  const { invalidate } = useThrelte();
  interactivity();

  let cameraRef = $state(null);
  let cafeRef = $state(null);
  let controlsRef = $state(null);

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
  const defaultZoom = 60;

  const defaultView = {
    enabled: true,
    fullWidth: 2000,
    fullHeight: 1000,
    offsetX: 113,
    offsetY: -150,
    width: 2000,
    height: 1000,
  };

  const changeFloor = (state) => {
    const displacementY = 2;
    const cafeTopFull = 7.34;
    const cafeTopHalf = 2.71;

    cafeTop.position.set(cafeTop.position.x, cafeTopFull, cafeTop.position.z);
    cafeTop.visible = true;
    cafeBot.visible = true;
    cafeStats.target = { ...cafeStats.current, y: 0 };

    if (state === 1) {
      cafeBot.visible = false;
      cafeStats.target = { ...cafeStats.current, y: displacementY };
      cafeTop.position.set(cafeTop.position.x, cafeTopHalf, cafeTop.position.z);
    } else if (state === 2) {
      cafeTop.visible = false;
      cafeStats.target = { ...cafeStats.current, y: displacementY };
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
</script>

<T.OrthographicCamera
  makeDefault
  position={[20, 0, 20]}
  zoom={defaultZoom}
  view={{ ...defaultView }}
  bind:ref={cameraRef}
>
  <OrbitControls
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

<Cafe bind:ref={cafeRef} position.y={cafeStats.current.y} />

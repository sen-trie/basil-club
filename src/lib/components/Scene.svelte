<script>
  import { changeFloor as changeFloorStore } from "$lib/stores/sceneControls";
  import { Spring } from "svelte/motion";
  import { T, useThrelte } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import Cafe from "$lib/components/models/cafe.svelte";

  const { invalidate } = useThrelte();

  let cameraRef = $state();
  let cafeRef = $state();
  let cafeStats = new Spring({ y: 0 });
  let currentFloor = $state(0);
  let cafeChild = $derived(cafeRef.children);
  let cafeTop = $derived(cafeChild[0]);
  let cafeBot = $derived(cafeChild[1]);

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
    offsetX: 75,
    offsetY: 35,
    width: 2000,
    height: 1000,
  };

  const changeFloor = (state) => {
    const switchSingleFloor = !(currentFloor === 0 || state === 0);
    cafeTop.visible = true;
    cafeBot.visible = true;
    cafeStats.target = { ...cafeStats.current, y: 0 };

    if (state === 1) {
      cafeBot.visible = false;
      cafeStats.target = { ...cafeStats.current, y: -2 };
      if (switchSingleFloor)
        cafeStats.set({ ...cafeStats.current, y: -2 }, { instant: true });
    } else if (state === 2) {
      cafeTop.visible = false;
      cafeStats.target = { ...cafeStats.current, y: 2.5 };
      if (switchSingleFloor)
        cafeStats.set({ ...cafeStats.current, y: 2.5 }, { instant: true });
    }

    invalidate();
    currentFloor = state;
  };

  changeFloorStore.set(changeFloor);
</script>

<!-- TODO:
 https://threlte.xyz/docs/reference/extras/camera-controls
Fit to Mesh
HUD -->

<T.OrthographicCamera
  makeDefault
  position={[10, 0, 10]}
  zoom={defaultZoom}
  view={{ ...defaultView }}
  bind:ref={cameraRef}
>
  <OrbitControls
    {minPolarAngle}
    {maxPolarAngle}
    {minAzimuthAngle}
    {maxAzimuthAngle}
    {enableDamping}
    {enablePan}
    minZoom={defaultZoom * 0.75}
    maxZoom={defaultZoom * 10}
  />
</T.OrthographicCamera>

<Cafe bind:ref={cafeRef} position.y={cafeStats.current.y} />

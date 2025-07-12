<script>
  import { changeFloor as changeFloorStore } from "$lib/stores/sceneControls";
  import { Spring } from "svelte/motion";
  import { T, useThrelte, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import Cafe from "$lib/components/models/cafe.svelte";
import { Vector3 } from 'three'

  const { invalidate } = useThrelte();

  let cameraRef = $state();
  let cafeRef = $state();

  const minPan = new Vector3(-2, -2, -2)
  const maxPan = new Vector3(2, 2, 2)
  let controlsRef = $state(null)

  let cafeStats = new Spring({ y: 0 });
  let currentFloor = $state(0);
  let cafeTop = $derived(cafeRef.children.find(child => child.name === 'Top'));
  let cafeBot = $derived(cafeRef.children.find(child => child.name === 'Bottom'));

  const minPolarAngle = 1.23;
  const maxPolarAngle = minPolarAngle;
  const minAzimuthAngle = 0.2;
  const maxAzimuthAngle = Math.PI / 2 - minAzimuthAngle;
  const enableDamping = true;
  const enablePan = true;
  const defaultZoom = 97;

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
    const switchSingleFloor = !(currentFloor === 0 || state === 0);
    const displacementY = 1

    cafeTop.visible = true;
    cafeBot.visible = true;
    cafeStats.target = { ...cafeStats.current, y: 0 };

    if (state === 1) {
      cafeBot.visible = false;
      cafeStats.target = { ...cafeStats.current, y: displacementY };
      cafeTop.position.set(cafeTop.position.x, 2.71, cafeTop.position.z)
    } else if (state === 2) {
      cafeTop.visible = false;
      cafeStats.target = { ...cafeStats.current, y: displacementY };
    }

    if (switchSingleFloor)
    cafeStats.set({ ...cafeStats.current, y: displacementY }, { instant: true });

    invalidate();
    currentFloor = state;
  };

  changeFloorStore.set(changeFloor);

  useTask((_delta) => {
    if (!controlsRef) return
    const target = controlsRef.target
    target.clamp(minPan, maxPan)
  })
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
    minZoom={defaultZoom * 0.75}
    maxZoom={defaultZoom * 3}
  />
</T.OrthographicCamera>

<Cafe bind:ref={cafeRef} position.y={cafeStats.current.y} />

<script>
  import { T } from "@threlte/core";
  import { CameraControls } from "@threlte/extras";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();
</script>

<T.PerspectiveCamera
  makeDefault={scene.currentState.povCamera}
  fov={40}
  position={[5.7, 0.35, 0.98]}
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
      ref.setTarget(0, -0.8, 0.1);
    }}
  />
</T.PerspectiveCamera>

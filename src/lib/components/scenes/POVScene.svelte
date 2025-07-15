<script>
  import { T } from "@threlte/core";
  import { CameraControls } from "@threlte/extras";

  let { povControlsEnabled } = $props();
</script>

<T.PerspectiveCamera
  makeDefault={povControlsEnabled}
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

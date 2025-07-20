<script>
  import { T } from "@threlte/core";
  import { CameraControls } from "@threlte/extras";

  let { povControlsEnabled } = $props();
</script>

<!-- 
Consider bottom diff -->
<T.PerspectiveCamera
  makeDefault={povControlsEnabled}
  fov={40}
  position={[5.7, 0.4, 0.9]}
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
      ref.setTarget(0, -0.6, 0.1);
    }}
  />
</T.PerspectiveCamera>

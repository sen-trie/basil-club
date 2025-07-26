<script>
  import { T } from "@threlte/core";
  import { HUD, OrbitControls, HTML } from "@threlte/extras";
  import EarlStreet from "$lib/components/models/earl-street.svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();
</script>

<HUD visible={scene.currentState.hudControls}>
  <T.OrthographicCamera makeDefault position={[12, 4, 10]} zoom={270}>
    <OrbitControls
      enabled={scene.currentState.hudControls}
      minZoom={270 * 0.75}
      maxZoom={270 * 1.25}
      enablePan={false}
    />
  </T.OrthographicCamera>
  <EarlStreet scale={1 / 0.9} rotation={[0, 0, 0]} />
  <HTML autoRender={false} center>
    <div class="hud-cover"></div>
  </HTML>
</HUD>

<style>
</style>

<script>
  import { T } from "@threlte/core";
  import { HUD, OrbitControls, HTML } from "@threlte/extras";
  import EarlStreet from "$lib/components/models/earl-street.svelte";

  let { hudControlsEnabled } = $props();
</script>

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
  <HTML autoRender={false} center>
    <div class="hud-cover"></div>
  </HTML>
</HUD>

<style>
</style>

<script>
  import { T } from "@threlte/core";
  import { HUD, OrbitControls, HTML, Billboard } from "@threlte/extras";
  import EarlStreet from "$lib/components/models/earl-street.svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import Hand from "$lib/assets/ui/hand.svelte";
  import { Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";

  let { browserZoomLevel } = $props();

  const scene = getScene();
  const offset = -0.2;

  let handTween = new Tween(0, {
    duration: 900,
    easing: cubicInOut,
  });

  $effect(() => {
    if (scene.currentState.hudControls) {
      handTween.set(offset);
      handTween
        .set(0.4 + offset)
        .then(() => handTween.set(-0.4 + offset))
        .then(() => handTween.set(offset))
        .then(() => {
          scene.clickEarlStreet();
        });
    }
  });
</script>

<HUD visible={scene.currentState.hudControls}>
  <T.OrthographicCamera
    makeDefault
    position={[12, 4, 10]}
    zoom={270 / browserZoomLevel}
  >
    <OrbitControls
      enabled={scene.currentState.hudControls}
      minZoom={(270 * 0.75) / browserZoomLevel}
      maxZoom={(270 * 1.25) / browserZoomLevel}
      enablePan={false}
    />
  </T.OrthographicCamera>
  <EarlStreet scale={1} rotation={[0, 0, 0]}>
    {#if scene.currentState.hudControls && !scene.currentState.earlstreetClicked}
      <Billboard>
        <HTML position.x={handTween.current} autoRender={true}>
          <div>
            <Hand />
          </div>
        </HTML>
      </Billboard>
    {/if}
  </EarlStreet>
</HUD>

<style>
  div {
    transform: rotate(-10deg);
  }
</style>

<script>
  import { T } from "@threlte/core";
  import { useGltf, useGltfAnimations, useKtx2, useDraco } from "@threlte/extras";
  import { GLTF } from "@threlte/extras";
  import { base } from "$app/paths";
  import { LoopOnce } from "three";

  let { fallback, error, children, ref = $bindable(), ...props } = $props();

  const ktx2Loader = useKtx2(`${base}/transcoder/`);
  const gltf = useGltf(`${base}/models/cat.glb`, {
    ktx2Loader: ktx2Loader,
    dracoLoader: useDraco(),
  });

  const { actions, mixer } = useGltfAnimations(gltf);
  let activeActionName = "Bored";
  const nextActionName = "Rumba";
  const IDLE_ANIMATION_NAME = activeActionName;

  $effect(() => {
    $actions[IDLE_ANIMATION_NAME]?.play();
    console.log($actions);
  });

  const playE = (e) => {
    if (e.key !== "d") return;

    if (activeActionName === nextActionName) return;

    const currentAction = $actions[activeActionName];
    const nextAction = $actions[nextActionName];

    if (currentAction && nextAction) {
      nextAction.reset().play();

      nextAction.setLoop(LoopOnce, 1);
      nextAction.clampWhenFinished = true;

      currentAction.crossFadeTo(nextAction, 0.5, true);

      activeActionName = nextActionName;
    }
  };

  $effect(() => {
    const onFinish = (e) => {
      const finishedActionName = e.action.getClip().name;

      if (finishedActionName !== IDLE_ANIMATION_NAME) {
        const currentAction = $actions[finishedActionName];
        const nextAction = $actions[IDLE_ANIMATION_NAME];

        if (currentAction && nextAction) {
          nextAction.reset().play();

          currentAction.crossFadeTo(nextAction, 0.5, true);

          activeActionName = IDLE_ANIMATION_NAME;
        }
      }
    };

    mixer.addEventListener("finished", onFinish);

    // Cleanup the listener
    return () => {
      mixer.removeEventListener("finished", onFinish);
    };
  });
</script>

<svelte:document onkeydown={playE} />

{#await gltf then { scene }}
  <T is={scene} position={[3, -1, 0]} scale={2} />
{/await}

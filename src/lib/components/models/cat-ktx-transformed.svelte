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
  const IDLE_ANIMATION_NAME = activeActionName;

  $effect(() => {
    $actions[IDLE_ANIMATION_NAME]?.play();
  });

  const playE = (e) => {
    if (e.key !== "d" || activeActionName !== IDLE_ANIMATION_NAME) {
      return;
    }

    const possibleNextAnimations = Object.keys($actions).filter(
      (name) => name !== IDLE_ANIMATION_NAME && name !== activeActionName,
    );
    if (possibleNextAnimations.length === 0) return;

    const nextActionName =
      possibleNextAnimations[Math.floor(Math.random() * possibleNextAnimations.length)];
    const currentAction = $actions[activeActionName];
    const nextAction = $actions[nextActionName];

    if (currentAction && nextAction) {
      nextAction.reset().setLoop(LoopOnce, 1).play();
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

    return () => {
      mixer.removeEventListener("finished", onFinish);
    };
  });

  let catScene = $state(null);

  $effect(() => {
    if (catScene) {
      catScene.children[1].position.set(1.1, -0.27, -0.1);
    }
  });
</script>

<svelte:document onkeydown={playE} />

{#await gltf then { scene }}
  <T bind:ref={catScene} is={scene} position={[1.35, -3.4, 0]} scale={1} />
{/await}

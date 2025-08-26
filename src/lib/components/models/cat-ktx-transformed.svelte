<script>
  import { T } from "@threlte/core";
  import { useGltf, useGltfAnimations, useKtx2, useDraco, useMeshopt } from "@threlte/extras";
  import { base } from "$app/paths";
  import { LoopOnce } from "three";
  import Hitbox from "./hitbox.svelte";

  let { fallback, error, children, ref = $bindable(), ...props } = $props();

  const ktx2Loader = useKtx2(`${base}/transcoder/`);
  const gltf = useGltf(`${base}/models/transformed/cat-transformed.glb`, {
    ktx2Loader: ktx2Loader,
    dracoLoader: useDraco(),
    meshoptDecoder: useMeshopt(),
  });

  const { actions, mixer } = useGltfAnimations(gltf);
  let activeActionName = "Bored";
  const IDLE_ANIMATION_NAME = activeActionName;

  $effect(() => {
    $actions[IDLE_ANIMATION_NAME]?.play();
  });

  const playE = () => {
    if (activeActionName !== IDLE_ANIMATION_NAME) {
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
</script>

{#await gltf then { scene }}
  <T is={scene} position={[1.35, -3.45, 0]} onclick={playE}>
    <Hitbox position={[1.2, 0.6, -0.15]} dim={[1.2, 2, 1]} />
  </T>
{/await}

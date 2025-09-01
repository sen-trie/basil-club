<script>
  import { T } from "@threlte/core";
  import { useGltf, useCursor, useKtx2, useDraco } from "@threlte/extras";
  import { base } from "$app/paths";
  import { DoubleSide } from "three/src/constants";
  import { onMount } from "svelte";

  const ktx2Loader = useKtx2(`${base}/transcoder/`);
  const load = () => {
    try {
      return useGltf(`${base}/models/transformed/m-toilet-transformed.glb`, {
        ktx2Loader: ktx2Loader,
        dracoLoader: useDraco(),
      });
    } catch (e) {
      console.error(e);
      return useGltf(`${base}/models/m-toilet.glb`, {});
    }
  };

  export const preload = async () => {
    await load();
  };

  let { fallback, error, children, ref = $bindable(), ...props } = $props();
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import Hitbox from "./hitbox.svelte";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  const scene = getScene();

  const { onPointerEnter, onPointerLeave } = useCursor();

  let signScale = new Tween([1, 1, 1], { duration: 175, easing: cubicOut });

  async function playTada() {
    await signScale.set([0.9, 0.9, 0.9]);
    await signScale.set([2, 2, 2]);
    await signScale.set([2, 2, 2]);
    await signScale.set([2, 2, 2]);
    await signScale.set([1, 1, 1]);
  }

  const gltf = load();

  onMount(() => {
    window.onerror = (message, source, lineno, colno, error) => {
      alert(message, source, lineno, colno, error);
      return true;
    };

    window.onunhandledrejection = (event) => {
      alert(event.reason);
    };
  });
</script>

<T.Group bind:ref dispose={false} scale={1.2} {...props}>
  {#await gltf}
    {@render fallback?.()}
  {:then gltf}
    <T.Mesh
      name="MT-Set3"
      geometry={gltf.nodes["MT-Set3"].geometry}
      material={gltf.materials["MT-Set3"]}
      position={[-2.05, 0.62, -1.69]}
    />
    <T.Mesh
      name="MT-Set1"
      geometry={gltf.nodes["MT-Set1"].geometry}
      material={gltf.materials["MT-Set1"]}
      position={[0.51, -0.38, -4.23]}
    >
      {#if scene.currentState.devBush === "control"}{:else if scene.currentState.devBush === "basic"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set1"].map}
          alphaTest={0.5}
          transparent={false}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.devBush === "opaq"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set1"].map}
          transparent={false}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.devBush === "trans"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set1"].map}
          transparent={true}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.devBush === "transAlpha"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set1"].map}
          transparent={true}
          premultipliedAlpha={true}
          depthWrite={true}
          side={DoubleSide}
        />
      {/if}

      <T.Mesh
        name="Bear_Sign"
        geometry={gltf.nodes.Bear_Sign.geometry}
        scale={signScale.current}
        onclick={(e) => {
          e.stopPropagation();
          if (!scene.currentState.interactables.bear) {
            playTada();
            scene.openDialog("bear-sign");
          }
          scene.setInteractable("bear");
        }}
      >
        <T.MeshBasicMaterial map={gltf.materials["MT-Set1"].map} transparent={false} />
        <Hitbox dim={[1.2, 1.2, 1.2]} />
      </T.Mesh>
    </T.Mesh>
    <T.Mesh name="MT-Set4" geometry={gltf.nodes["MT-Set4"].geometry} position={[0.17, -0.76, 0.75]}>
      {#if scene.currentState.devFire === "control"}{:else if scene.currentState.devFire === "basic"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set4"].map}
          alphaTest={0.5}
          transparent={false}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.devFire === "opaq"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set4"].map}
          transparent={false}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.devFire === "trans"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set4"].map}
          transparent={true}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.devFire === "transAlpha"}
        <T.MeshBasicMaterial
          map={gltf.materials["MT-Set4"].map}
          transparent={true}
          premultipliedAlpha={true}
          depthWrite={true}
          side={DoubleSide}
        />
      {/if}

      <T.Mesh
        name="Camp_Bench"
        geometry={gltf.nodes.Camp_Bench.geometry}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
        onclick={(e) => {
          e.stopPropagation();
          window.open("https://www.youtube.com/watch?v=RgBwLQty8B4", "_blank");
        }}
      >
        <T.MeshBasicMaterial map={gltf.materials["MT-Set4"].map} />
        <Hitbox dim={[1.5, 1.5, 1.5]} position={[-1.7, 0, 0.5]} />
      </T.Mesh>
    </T.Mesh>
    <T.Mesh
      name="MT-Set2"
      geometry={gltf.nodes["MT-Set2"].geometry}
      material={gltf.materials["MT-Set2"]}
      position={[-2.38, 0.07, -3.22]}
    />
    <T.Mesh
      name="Maple_Tree"
      geometry={gltf.nodes.Maple_Tree.geometry}
      position={[0.37, 1.28, -3.97]}
    >
      {#if scene.currentState.dev === "control"}{:else if scene.currentState.dev === "basic"}
        <T.MeshBasicMaterial
          map={gltf.materials["Maple Tree"].map}
          alphaTest={0.5}
          transparent={false}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.dev === "opaq"}
        <T.MeshBasicMaterial
          map={gltf.materials["Maple Tree"].map}
          transparent={false}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.dev === "trans"}
        <T.MeshBasicMaterial
          map={gltf.materials["Maple Tree"].map}
          transparent={true}
          depthWrite={true}
          side={DoubleSide}
        />
      {:else if scene.currentState.dev === "transAlpha"}
        <T.MeshBasicMaterial
          map={gltf.materials["Maple Tree"].map}
          transparent={true}
          premultipliedAlpha={true}
          depthWrite={true}
          side={DoubleSide}
        />
      {/if}
    </T.Mesh>
  {:catch err}
    {@render error?.({ error: err })}
  {/await}

  {@render children?.({ ref })}
</T.Group>

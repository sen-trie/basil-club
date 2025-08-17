<script>
  import { T } from "@threlte/core";
  import { useGltf, useKtx2, useDraco } from "@threlte/extras";

  const ktx2Loader = useKtx2("/transcoder/");
  const load = () => {
    return useGltf("/models/transformed/earl-street-ktx-transformed.glb", {
      ktx2Loader: ktx2Loader,
      dracoLoader: useDraco(),
    });
  };

  export const preload = async () => {
    await load();
  };

  let { fallback, error, children, ref = $bindable(), ...props } = $props();

  const gltf = load();
</script>

<T.Group bind:ref dispose={false} {...props}>
  {#await gltf}
    {@render fallback?.()}
  {:then gltf}
    <T.Mesh
      name="Earl_Street"
      geometry={gltf.nodes.Earl_Street.geometry}
      material={gltf.materials.Seven}
    >
      <T.Mesh
        name="Earl_Street_Shell"
        geometry={gltf.nodes.Earl_Street_Shell.geometry}
        material={gltf.materials["Lego Shell"]}
      />
    </T.Mesh>
  {:catch err}
    {@render error?.({ error: err })}
  {/await}

  {@render children?.({ ref })}
</T.Group>

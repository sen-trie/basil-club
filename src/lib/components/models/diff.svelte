<script>
  let { fallback, error, children, ref = $bindable(), ...props } = $props();
  import { showOverlay } from "$lib/stores/sceneControls";
  import { useCursor } from "@threlte/extras";

  const gltf = load();
  const { onPointerEnter, onPointerLeave } = useCursor();
  let change = () => {};
  showOverlay.subscribe((fn) => {
    change = fn;
  });
</script>

<T.Mesh
  name="Painting_Set"
  geometry={gltf.nodes.Painting_Set.geometry}
  material={gltf.materials["Painting Set"]}
  onpointerenter={onPointerEnter}
  onpointerleave={onPointerLeave}
  onclick={(e) => {
    e.stopPropagation();
    change("photo");
  }}
/>

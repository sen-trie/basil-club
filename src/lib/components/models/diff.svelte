<script>
  let { fallback, error, children, ref = $bindable(), ...props } = $props();
  import { showOverlay, showHud } from "$lib/stores/sceneControls";

  const gltf = load();

  let changeOverlay = () => {};
  showOverlay.subscribe((fn) => {
    changeOverlay = fn;
  });

  let changeHud = () => {};
  showHud.subscribe((fn) => {
    changeHud = fn;
  });
</script>

<T.Mesh
  name="Painting_Set"
  geometry={gltf.nodes.Painting_Set.geometry}
  material={gltf.materials["Painting Set"]}
  onclick={(e) => {
    e.stopPropagation();
    changeOverlay("photo");
  }}
/>

<T.Mesh
  name="Photo_Hitbox"
  geometry={gltf.nodes.Photo_Hitbox.geometry}
  position={[0, -0.04, 0]}
  rotation={[0, 0, Math.PI]}
  scale={[-1.19, -0.9, -0.08]}
  onclick={(e) => {
    e.stopPropagation();
    changeOverlay("grid");
  }}
>
  <T.MeshBasicMaterial transparent opacity={0} depthWrite={false} />
</T.Mesh>

<T.Mesh
  name="Earl_Street"
  geometry={gltf.nodes.Earl_Street.geometry}
  material={gltf.materials["Lego Group"]}
  onclick={(e) => {
    e.stopPropagation();
    changeHud("earl");
  }}
/>

<T.Mesh
  name="Flag_Hitbox"
  geometry={gltf.nodes.Flag_Hitbox.geometry}
  material={gltf.nodes.Flag_Hitbox.material}
  rotation={[-Math.PI, 0.41, -Math.PI]}
  scale={[0.12, 0.18, 0.12]}
  onclick={(e) => {
    e.stopPropagation();
    changeOverlay("grid");
  }}
>
  <T.MeshBasicMaterial transparent opacity={0} depthWrite={false} />
</T.Mesh>

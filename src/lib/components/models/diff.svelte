<script>
  let {
    fallback,
    error,
    children,
    ref = $bindable(),
    hudControlsEnabled,
    ...props
  } = $props();
  import { CircleGeometry } from "three";
  import {
    showOverlay,
    showHud,
    changeFloor as changeFloorStore,
  } from "$lib/stores/sceneControls";
  import { Sheet, SheetObject, Sequence } from "@threlte/theatre";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const gltf = load();
  let changeOverlay = () => {};
  showOverlay.subscribe((fn) => {
    changeOverlay = fn;
  });

  let changeHud = () => {};
  showHud.subscribe((fn) => {
    changeHud = fn;
  });

  const scene = getScene();

  const { invalidate } = useThrelte();

  let currentFloor = $state(0);
  let cafeTopY = $state(7.34);
  let cafeBottomY = $state(1.47);

  const changeFloor = (state) => {
    if (hudControlsEnabled) return;

    const cafeTopFull = 7.34;
    const cafeTopHalf = 2.71;
    const cafeBotFull = 1.47;
    const nullZone = -99;

    cafeTopY = cafeTopFull;
    cafeBottomY = cafeBotFull;

    if (state === 1) {
      cafeTopY = cafeTopHalf;
      cafeBottomY = nullZone;
    } else if (state === 2) {
      cafeTopY = nullZone;
    }

    invalidate();
    currentFloor = state;
  };
  changeFloorStore.set(changeFloor);
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

<T.Mesh
  name="Toilet-F"
  geometry={gltf.nodes["Toilet-F"].geometry}
  material={gltf.materials["Toilet Door.001"]}
  position={[-1.49, -1.37, -0.83]}
  onclick={(e) => {
    e.stopPropagation();
    scene.setFToilet();
  }}
/>
<T.Mesh
  name="Toilet-M"
  geometry={gltf.nodes["Toilet-M"].geometry}
  material={gltf.materials["Toilet Door.001"]}
  position={[0.03, -1.37, -0.83]}
  onclick={(e) => {
    e.stopPropagation();
    scene.setMToilet();
  }}
/>

{#if scene.currentState.interactables.bear}
  <T.Group
    name="Bear"
    position={[4.98, -2.86, 3.78]}
    onclick={(e) => {
      e.stopPropagation();
      changeOverlay("bear");
    }}
  >
    <T.Mesh
      name="Sphere002"
      geometry={gltf.nodes.Sphere002.geometry}
      material={gltf.materials.fabric_pink}
    />
    <T.Mesh
      name="Sphere002_1"
      geometry={gltf.nodes.Sphere002_1.geometry}
      material={gltf.materials.fabric_pink}
    />
    <T.Mesh
      name="Sphere002_2"
      geometry={gltf.nodes.Sphere002_2.geometry}
      material={gltf.materials.fabric_pink}
    />
    <T.Mesh
      name="Sphere002_3"
      geometry={gltf.nodes.Sphere002_3.geometry}
      material={gltf.materials.fabric_pink}
    />
    <T.Mesh
      name="Sphere002_4"
      geometry={gltf.nodes.Sphere002_4.geometry}
      material={gltf.materials.fabric_pink}
    />
    <T.Mesh
      name="Sphere002_5"
      geometry={gltf.nodes.Sphere002_5.geometry}
      material={gltf.materials.fabric_pink}
    />
    <T.Mesh
      name="Sphere002_6"
      geometry={gltf.nodes.Sphere002_6.geometry}
      material={gltf.materials.fabric_pink}
    />
  </T.Group>
  <T.Mesh
    name="Disturb"
    geometry={gltf.nodes.Disturb.geometry}
    material={gltf.materials.Disturb}
    position={[5.4, -3.02, 3.42]}
  />
{/if}

<Sheet>
  <Sequence iterationCount={Infinity} autoplay delay={1000}>
    <SheetObject key="Cat Base">
      {#snippet children({ Transform })}
        <Transform>
          <T.Group name="Cat_Base" rotation={[0, 0, 0]} visible={true}>
            <T.Mesh
              name="Cylinder"
              geometry={gltf.nodes.Cylinder.geometry}
              material={gltf.materials["Robot Black"]}
            />
            <T.Mesh
              name="Cylinder_1"
              geometry={gltf.nodes.Cylinder_1.geometry}
              material={gltf.materials["Robot Black"]}
            />
            <T.Mesh
              name="Cylinder_2"
              geometry={gltf.nodes.Cylinder_2.geometry}
              material={gltf.materials["Robot Black"]}
            />
            <SheetObject key="Cat Face">
              {#snippet children({ Transform })}
                <Transform>
                  <T.Group name="Cat_Face" position={[0, 0.63, 0]}>
                    <T.Mesh
                      name="Sphere"
                      geometry={gltf.nodes.Sphere.geometry}
                      material={gltf.materials["Robot Black"]}
                    />
                    <T.Mesh
                      name="Sphere_1"
                      geometry={gltf.nodes.Sphere_1.geometry}
                      material={gltf.materials["Robot Black"]}
                    />
                    <T.Mesh
                      name="Sphere_2"
                      geometry={gltf.nodes.Sphere_2.geometry}
                      material={gltf.materials["Robot Face"]}
                    />
                  </T.Group>
                </Transform>
              {/snippet}
            </SheetObject>
          </T.Group>
          <T.Mesh
            name="FakeShadow"
            geometry={new CircleGeometry(0.39, 32)}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.685, 0]}
          >
            <T.MeshBasicMaterial
              transparent={true}
              opacity={0.25}
              color="black"
            />
          </T.Mesh>
        </Transform>
      {/snippet}
    </SheetObject>
  </Sequence>
</Sheet>
<Sheet>
  <Sequence iterationCount={Infinity} autoplay delay={1000}>
    <SheetObject key="POV Base">
      {#snippet children({ Transform })}
        <Transform>
          <T.Group name="Cat_Base" rotation={[0, 0, 0]}>
            <T.Mesh
              name="Cylinder"
              geometry={gltf.nodes.Cylinder.geometry}
              material={gltf.materials["Robot Black"]}
            />
            <T.Mesh
              name="Cylinder_1"
              geometry={gltf.nodes.Cylinder_1.geometry}
              material={gltf.materials["Robot Black"]}
            />
            <T.Mesh
              name="Cylinder_2"
              geometry={gltf.nodes.Cylinder_2.geometry}
              material={gltf.materials["Robot Black"]}
            />
            <SheetObject key="POV Face">
              {#snippet children({ Transform })}
                <Transform>
                  <T.Group name="Cat_Face" position={[0, 0.63, 0]}>
                    <T.Mesh
                      name="Sphere"
                      geometry={gltf.nodes.Sphere.geometry}
                      material={gltf.materials["Robot Black"]}
                    />
                    <T.Mesh
                      name="Sphere_1"
                      geometry={gltf.nodes.Sphere_1.geometry}
                      material={gltf.materials["Robot Black"]}
                    />
                    <T.Mesh
                      name="Sphere_2"
                      geometry={gltf.nodes.Sphere_2.geometry}
                      material={gltf.materials["Robot Face"]}
                    />
                  </T.Group>
                </Transform>
              {/snippet}
            </SheetObject>
          </T.Group>
        </Transform>
      {/snippet}
    </SheetObject>
  </Sequence>
</Sheet>

<script>
  import { T, useTask } from "@threlte/core";
  import { useGltf, useKtx2, useDraco, Instance, InstancedMesh, useCursor } from "@threlte/extras";
  import { Sheet, SheetObject, Sequence } from "@threlte/theatre";
  import { base } from "$app/paths";
  import { dev } from "$app/environment";
  import { isMobile } from "$lib/stores/worldState.svelte.js";
  import Cat from "./cat-ktx-transformed.svelte";

  const ktx2Loader = useKtx2(`${base}/transcoder/`);
  const load = () => {
    return useGltf(`${base}/models/transformed/cafe-rc5-transformed.glb`, {
      ktx2Loader: ktx2Loader,
      dracoLoader: useDraco(),
    });
  };

  export const preload = async () => {
    await load();
  };

  let { fallback, error, children, ref = $bindable(), ...props } = $props();
  import { CircleGeometry, TextureLoader, ClampToEdgeWrapping, LinearFilter } from "three";
  import { onMount } from "svelte";
  import { Tween } from "svelte/motion";
  import { cubicInOut, linear } from "svelte/easing";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import Hitbox from "./hitbox.svelte";

  const scene = getScene();

  const gltf = load();

  const nullZone = -999;
  const hideZone = (t, condition) => {
    return condition ? nullZone : t;
  };

  const cafeTopFull = 7.34;
  const cafeTopHalf = 2.71;
  const cafeBotFull = 1.47;

  let bearVisible = $state(true);
  const bearKeyframe = 125;
  let bearScale = new Tween([1, 1, 1], {
    duration: bearKeyframe,
    easing: cubicInOut,
  });

  let bearRotation = new Tween([0, 0, 0], {
    duration: bearKeyframe,
    easing: cubicInOut,
  });

  let bearYDelta = new Tween(0, {
    duration: bearKeyframe,
    easing: cubicInOut,
  });

  async function playTada() {
    await Promise.all([
      bearScale.set([0.9, 0.9, 0.9]),
      bearRotation.set([0, 0, (-3 * Math.PI) / 180]),
      bearYDelta.set(0.05),
    ]);
    await Promise.all([
      bearScale.set([1.2, 1.2, 1.2]),
      bearRotation.set([0, 0, (3 * Math.PI) / 180]),
      bearYDelta.set(0.1),
    ]);
    await Promise.all([
      bearScale.set([1.2, 1.2, 1.2]),
      bearRotation.set([0, 0, (-3 * Math.PI) / 180]),
    ]);
    await Promise.all([
      bearScale.set([1.2, 1.2, 1.2]),
      bearRotation.set([0, 0, (3 * Math.PI) / 180]),
    ]);
    await Promise.all([bearScale.set([1, 1, 1]), bearRotation.set([0, 0, 0]), bearYDelta.set(0)]);
  }

  let cafeTopY = $derived.by(() => {
    if (scene.currentState.currentFloor === 0) {
      return cafeTopFull;
    } else if (scene.currentState.currentFloor === 1) {
      return cafeTopHalf;
    } else {
      return nullZone;
    }
  });

  let cafeBottomY = $derived.by(() => {
    if (scene.currentState.currentFloor === 0) {
      return cafeBotFull;
    } else if (scene.currentState.currentFloor === 1) {
      return nullZone;
    } else {
      return cafeBotFull;
    }
  });

  let robotPOVController = $state(null);
  const rotationTween = new Tween(0, {
    duration: 2000,
    easing: linear,
  });

  function loopRotation() {
    const nextRotation = rotationTween.current + Math.PI * 2;
    rotationTween.set(nextRotation).then(loopRotation);
  }

  loopRotation();

  const plateKeyframe = 650;
  let plateLocation = new Tween([0, 0, 0], {
    duration: plateKeyframe,
    easing: cubicInOut,
  });

  const consumeDessert = (e) => {
    if (!scene.currentState.currentPlate || scene.currentState.currentPlate === "") return;

    e.stopPropagation();
    plateLocation.set([1, 0.18, 0.14]).then(() => {
      setTimeout(() => {
        scene.currentState.currentPlate = "empty";
        plateLocation.set([0, 0, 0.0]);
      }, scene.eatTime);
    });
    scene.setOverlay("eat");
    scene.playSound("eat");
  };

  const { hovering } = useCursor("grab");
  let faceTextures = $state([]);
  let currentFaceRoam = $state(4);
  let nextFaceRoam = $state(4);
  let roamingAlpha = new Tween(1, {
    duration: 450,
    easing: linear,
  });

  function changeRoam(index) {
    if (index === currentFaceRoam) return;

    nextFaceRoam = index;
    roamingAlpha.set(0).then(() => {
      currentFaceRoam = index;
      roamingAlpha.set(1, { duration: 0 });
    });
  }

  let currentFacePOV = $state(0);
  let nextFacePOV = $state(0);
  let transitionAlpha = new Tween(1, {
    duration: 300,
    easing: linear,
  });

  function changeFace(index) {
    nextFacePOV = index;
    transitionAlpha.set(0).then(() => {
      currentFacePOV = index;
      transitionAlpha.set(1, { duration: 0 });
    });
  }

  onMount(() => {
    const loader = new TextureLoader();
    faceTextures = Array.from({ length: 10 }, (_, i) => {
      const tex = loader.load(`${base}/textures/cat-face/face-${i}.webp`);
      tex.colorSpace = "srgb";
      tex.flipY = false;
      tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;

      return tex;
    });
  });

  let cooldownActive = $state(false);
  let faceResetTimeout = $state(null);
  let timer = 0;

  const faceWeights = [40, 15, 15, 10, 10, 2, 25, 15, 25, 15];
  function weightedRandom(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      if (r < weights[i]) return i;
      r -= weights[i];
    }
    return weights.length - 1;
  }

  useTask((delta) => {
    timer += delta;
    if (timer >= 5) {
      const weight = scene.currentState.plateCount > 4 ? faceWeights : faceWeights.slice(0, 6);
      let newFaceRoam = weightedRandom(weight);

      changeRoam(newFaceRoam);
      timer = 0;
    }
  });
</script>

<T.Group bind:ref dispose={false} {...props}>
  {#await gltf}
    {@render fallback?.()}
  {:then gltf}
    <T.Mesh
      name="Wall"
      geometry={gltf.nodes.Wall.geometry}
      material={gltf.materials.Backdrop}
      position={[4.25, 5.89, 11.56]}
    />
    <T.Mesh
      name="Bottom"
      geometry={gltf.nodes.Bottom.geometry}
      material={gltf.materials.Three}
      position={[2.15, cafeBottomY, -2.77]}
    >
      <T.Mesh
        name="Bottom_Wall"
        geometry={gltf.nodes.Bottom_Wall.geometry}
        material={gltf.materials.Misc}
        position={[-1, -0.46, 6.76]}
        visible={scene.currentState.povCamera}
      />
      <Sheet name="Robot-Roam">
        <Sequence
          iterationCount={Infinity}
          autoplay
          delay={1000}
          rate={Math.max(0.25, 1 - scene.currentState.plateCount * 0.04) * 1.25}
        >
          <SheetObject key="Cat Base">
            {#snippet children({ Transform })}
              <Transform>
                <T.Group
                  name="Cat_Base_Roam"
                  rotation={[0, 0, 0]}
                  visible={scene.currentState.interactables.flag && !scene.currentState.povCamera}
                >
                  <InstancedMesh position={[0, 0.35, 0]} frustumCulled={false}>
                    <T.BufferGeometry is={gltf.nodes.Order_Plate.geometry} />
                    <T.MeshStandardMaterial is={gltf.materials.Misc} />

                    {#each Array(scene.currentState.plateCount) as _, i}
                      <Instance position={[0, i * 0.04, 0]} />
                    {/each}
                  </InstancedMesh>
                  <T.Mesh
                    name="Cat_Base"
                    geometry={gltf.nodes.Cat_Base.geometry}
                    material={gltf.materials["Robot Texure"]}
                  />
                  <SheetObject key="Cat Face Roam">
                    {#snippet children({ Transform })}
                      <Transform>
                        <T.Group name="Cat_Face_Roam" position={[0, 0.63, 0]}>
                          <T.Mesh
                            name="Sphere"
                            geometry={gltf.nodes.Sphere.geometry}
                            material={gltf.materials["Robot Texure"]}
                          />
                          <T.Mesh name="Sphere_2_Front" geometry={gltf.nodes.Sphere_1.geometry}>
                            <T.MeshBasicMaterial
                              transparent={true}
                              opacity={1 - roamingAlpha.current}
                              map={faceTextures[nextFaceRoam]}
                            />
                          </T.Mesh>
                          <T.Mesh name="Sphere_2_Back" geometry={gltf.nodes.Sphere_1.geometry}>
                            <T.MeshBasicMaterial
                              transparent={true}
                              opacity={roamingAlpha.current}
                              map={faceTextures[currentFaceRoam]}
                            />
                          </T.Mesh>
                        </T.Group>
                      </Transform>
                    {/snippet}
                  </SheetObject>
                  <T.Mesh
                    name="FakeShadow"
                    geometry={new CircleGeometry(0.39, 32)}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -0.685, 0]}
                  >
                    <T.MeshBasicMaterial transparent={true} opacity={0.25} color="black" />
                  </T.Mesh> -->
                </T.Group>
              </Transform>
            {/snippet}
          </SheetObject>
        </Sequence>
      </Sheet>
      <Sheet name="Robot-POV">
        <Sequence autoplay={false} bind:this={robotPOVController}>
          <SheetObject key="POV Base">
            {#snippet children({ Transform })}
              <Transform>
                <T.Group
                  name="Cat_Base_POV"
                  rotation={[0, 0, 0]}
                  visible={scene.currentState.povCamera}
                >
                  <T.Mesh
                    name="Cat_Base"
                    geometry={gltf.nodes.Cat_Base.geometry}
                    material={gltf.materials["Robot Texure"]}
                  />
                  <T.Mesh
                    name="Tablet"
                    geometry={gltf.nodes.Tablet.geometry}
                    material={gltf.materials.Misc}
                    position={[0, hideZone(0.34 + 0.1, !scene.currentState.povCamera), 0.01]}
                    rotation={[0, rotationTween.current, -0.5]}
                    onclick={(e) => {
                      e.stopPropagation();
                      scene.setOverlay("flag");
                    }}
                  >
                    <Hitbox dim={[0.7, 0.5, 0.7]} position={[0, -0.02, 0]} rotation.z={0.5} />
                  </T.Mesh>
                  <SheetObject key="POV Face">
                    {#snippet children({ Transform })}
                      <Transform>
                        <T.Group
                          name="Cat_Face_POV"
                          onpointerenter={() => ($hovering = true)}
                          onpointerleave={() => ($hovering = false)}
                          position.y={hideZone(0.63, !scene.currentState.povCamera)}
                          onclick={(e) => {
                            e.stopPropagation();
                            if (cooldownActive) return;

                            let newFace = 1 + Math.floor(Math.random() * 4);
                            while (newFace === currentFacePOV) {
                              newFace = 1 + Math.floor(Math.random() * 4);
                            }

                            changeFace(newFace);

                            clearTimeout(faceResetTimeout);
                            faceResetTimeout = setTimeout(
                              () => {
                                changeFace(0);
                                cooldownActive = false;
                              },
                              1000 + Math.floor(Math.random() * 2000),
                            );
                            cooldownActive = true;
                          }}
                        >
                          <T.Mesh
                            name="Sphere"
                            geometry={gltf.nodes.Sphere.geometry}
                            material={gltf.materials["Robot Texure"]}
                          />
                          <T.Mesh name="Sphere_2_Front" geometry={gltf.nodes.Sphere_1.geometry}>
                            <T.MeshBasicMaterial
                              transparent={true}
                              opacity={1 - transitionAlpha.current}
                              map={faceTextures[nextFacePOV]}
                            />
                          </T.Mesh>
                          <T.Mesh name="Sphere_2_Back" geometry={gltf.nodes.Sphere_1.geometry}>
                            <T.MeshBasicMaterial
                              transparent={true}
                              opacity={transitionAlpha.current}
                              map={faceTextures[currentFacePOV]}
                            />
                          </T.Mesh>
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
      <T.Mesh
        name="Flag"
        geometry={gltf.nodes.Flag.geometry}
        material={gltf.materials.Misc}
        position={[1.94, hideZone(-1.46, scene.currentState.povCamera), 3.39]}
        visible={!scene.currentState.povCamera}
        onclick={(e) => {
          e.stopPropagation();
          scene.togglePOVCamera();
          if (!scene.currentState.interactables.flag) {
            robotPOVController.position = 0;
            robotPOVController.play();
          }
        }}
      >
        <T.Mesh
          name="Flag_Hitbox"
          geometry={gltf.nodes.Flag_Hitbox.geometry}
          onclick={(e) => {
            e.stopPropagation();
            scene.togglePOVCamera();
            if (!scene.currentState.interactables.flag) {
              robotPOVController.position = 0;
              robotPOVController.play();
            }
          }}
        >
          <T.MeshBasicMaterial transparent opacity={0} depthWrite={false} />
          <Hitbox dim={[1, 1, 1]} />
        </T.Mesh>
      </T.Mesh>
      <T.Mesh
        name="Four"
        geometry={gltf.nodes.Four.geometry}
        material={gltf.materials.Four}
        position={[0.49, -2.22, 3.36]}
      />
      <T.Group
        name="Dish"
        position={scene.currentState.povCamera
          ? plateLocation.current
          : [nullZone, nullZone, nullZone]}
        visible={scene.currentState.povCamera && scene.currentState.currentPlate != ""}
      >
        <T.Mesh
          name="Order_Plate"
          geometry={gltf.nodes.Order_Plate.geometry}
          material={gltf.materials.Misc}
          position={[2.3, -1.64, 3.55]}
        >
          <T.Group
            name="Dish Collection"
            onclick={(e) => {
              if (scene.currentState.currentPlate === "empty") return;
              consumeDessert(e);
            }}
          >
            <Hitbox dim={[0.6, 0.3, 0.6]} position.y={0.1} />
            {#if scene.currentState.currentPlate === "earlgrey-cheesecake"}
              <T.Mesh
                name="Basque_Cheesecake"
                geometry={gltf.nodes.Basque_Cheesecake.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[-0.01, 0.06, 0.01]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "brownie-cheesecake"}
              <T.Mesh
                name="Brownie_Basque"
                geometry={gltf.nodes.Brownie_Basque.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0.05, 0.03, 0]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "cheesecake"}
              <T.Mesh
                name="Chesecake"
                geometry={gltf.nodes.Chesecake.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0.02, 0.07, -0.01]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "choc-cremebrulee"}
              <T.Mesh
                name="Choc_Ramekin"
                geometry={gltf.nodes.Choc_Ramekin.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0, 0.06, 0]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "financier"}
              <T.Mesh
                name="Financier"
                geometry={gltf.nodes.Financier.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0, 0.02, -0.01]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "lava-cake"}
              <T.Mesh
                name="Lava_Cake"
                geometry={gltf.nodes.Lava_Cake.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0, 0.03, 0]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "matcha-cake"}
              <T.Mesh
                name="Matcha_Cake"
                geometry={gltf.nodes.Matcha_Cake.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0, 0.03, 0]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "matcha-muffin"}
              <T.Mesh
                name="Muffin"
                geometry={gltf.nodes.Muffin.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0, 0.03, 0]}
              />
            {/if}
            {#if scene.currentState.currentPlate === "cremebrulee"}
              <T.Mesh
                name="Ramekin"
                geometry={gltf.nodes.Ramekin.geometry}
                material={gltf.materials["Dessert Order"]}
                position={[0, 0.06, 0]}
              />
            {/if}
          </T.Group>
        </T.Mesh>
      </T.Group>
      <T.Mesh
        name="Seven"
        geometry={gltf.nodes.Seven.geometry}
        material={gltf.materials.Seven}
        position={[-4.48, -0.64, 1.47]}
      >
        <T.Mesh
          name="Earl_Street"
          geometry={gltf.nodes.Earl_Street.geometry}
          material={gltf.materials.Seven}
          onclick={(e) => {
            e.stopPropagation();
            scene.toggleHud();
          }}
        >
          <!-- <T.Mesh
            name="Earl_Street_Shell"
            geometry={gltf.nodes.Earl_Street_Shell.geometry}
            material={gltf.materials["Lego Shell"]}
          /> -->
          <Hitbox dim={[1.5, 1.5, 5]} position={[0, -0.15, -0.9]} />
        </T.Mesh>
      </T.Mesh>
      <T.Mesh
        name="Toilet-F"
        geometry={gltf.nodes["Toilet-F"].geometry}
        material={gltf.materials.Seven}
        position={[-1.49, -1.37, -0.83]}
        onclick={(e) => {
          e.stopPropagation();
          scene.setFToilet();
        }}
      >
        <Hitbox dim={[1.9, 3, 1]} position={[-0.2, 0.1, 0]} />
      </T.Mesh>
      <T.Mesh
        name="Toilet-M"
        geometry={gltf.nodes["Toilet-M"].geometry}
        material={gltf.materials.Seven}
        position={[0.03, -1.37, -0.83]}
        onclick={(e) => {
          e.stopPropagation();
          if (scene.currentState.hudControls) return;
          if (scene.currentState.interactables.fToilet) {
            scene.setMToilet();
          } else {
            scene.openDialog("men");
          }
        }}
      >
        <Hitbox dim={[1.9, 3, 1]} position={[0.2, 0.1, 0]} />
      </T.Mesh>
      <T.Mesh
        name="Two"
        geometry={gltf.nodes.Two.geometry}
        material={gltf.materials.Two}
        position={[-3, -2.07, 3.46]}
      />
    </T.Mesh>
    <T.Mesh
      name="Top"
      geometry={gltf.nodes.Top.geometry}
      material={gltf.materials.Top}
      position={[-1.58, cafeTopY, -1.92]}
    >
      <Cat />
      {#if scene.currentState.interactables.bear}
        <T.Mesh
          name="Bear"
          material={gltf.materials.Bear}
          geometry={gltf.nodes.Bear.geometry}
          position={[4.98, bearVisible ? -2.86 + bearYDelta.current : nullZone, 3.78]}
          visible={bearVisible}
          scale={bearScale.current}
          rotation={bearRotation.current}
          onclick={(e) => {
            e.stopPropagation();
            const res = scene.touchBear();
            if (res === true) {
              scene.setOverlay("bear");
              setTimeout(() => {
                bearVisible = false;
              }, 2000);
            } else if (res === false) {
              playTada();
              scene.playSound("bear");
            }
          }}
        >
          <Hitbox dim={[1, 1, 1]} />
        </T.Mesh>
        <T.Mesh
          name="Disturb"
          geometry={gltf.nodes.Disturb.geometry}
          material={gltf.materials.Misc}
          position={[5.4, -3.02, 3.42]}
        />
      {/if}
      <T.Mesh
        name="Cashier_Screen"
        geometry={gltf.nodes.Cashier_Screen.geometry}
        material={gltf.materials.Ten}
        position={[4.12, -2.77, 0.75]}
        onclick={(e) => {
          e.stopPropagation();
          scene.setOverlay("payment");
        }}
      >
        <Hitbox dim={[1, 1, 1]} position={[-2.4, 0.15, 0]} />
      </T.Mesh>
      <T.Mesh
        name="Eight"
        geometry={gltf.nodes.Eight.geometry}
        material={gltf.materials.Eight}
        position={[0.02, -1.99, -1.68]}
      >
        <T.Mesh
          name="Photo_Grid"
          geometry={gltf.nodes.Photo_Grid.geometry}
          material={gltf.materials.Eight}
          position={[-0.12, -0.12, -0.04]}
        >
          <T.Mesh
            name="Photo_Hitbox"
            geometry={gltf.nodes.Photo_Hitbox.geometry}
            position={[0, -0.04, 0]}
            onclick={(e) => {
              e.stopPropagation();
              scene.setOverlay("grid");
            }}
          >
            <Hitbox dim={[2.5, 2.5, 1]} />
            <T.MeshBasicMaterial transparent opacity={0} depthWrite={false} />
          </T.Mesh>
        </T.Mesh>
      </T.Mesh>
      <T.Mesh
        name="Eleven"
        geometry={gltf.nodes.Eleven.geometry}
        material={gltf.materials.Eleven}
        position={[5.83, -2.86, -1.43]}
      />
      <T.Mesh
        name="Nine"
        geometry={gltf.nodes.Nine.geometry}
        material={gltf.materials.Nine}
        position={[-0.68, -4.13, 1.12]}
      />
      <T.Mesh
        name="Painting_Set"
        geometry={gltf.nodes.Painting_Set.geometry}
        material={gltf.materials.One}
        position={[-1.73, -2.13, 0.39]}
        onclick={(e) => {
          e.stopPropagation();
          scene.setOverlay("photo");
        }}
      >
        <Hitbox dim={[1, 3, 4]} />
      </T.Mesh>
      <T.Mesh
        name="Six"
        geometry={gltf.nodes.Six.geometry}
        material={gltf.materials.Six}
        position={[-0.68, -4.13, 1.12]}
        onclick={(e) => {
          e.stopPropagation();
        }}
      />
      <T.Mesh
        name="Ten"
        geometry={gltf.nodes.Ten.geometry}
        material={gltf.materials.Ten}
        position={[4.12, -2.77, 0.75]}
      />
      <T.Mesh
        name="Twelve"
        geometry={gltf.nodes.Twelve.geometry}
        material={gltf.materials.Twelve}
        position={[1.27, -2.64, 0.69]}
      />
    </T.Mesh>
  {:catch err}
    {@render error?.({ error: err })}
  {/await}

  {@render children?.({ ref })}
</T.Group>

<script>
  import { T } from "@threlte/core";
  import { isMobile } from "$lib/stores/worldState.svelte.js";

  let { dim, ...props } = $props();

  const scale = $isMobile ? [1, 1, 1] : [0.8, 0.8, 0.8];
</script>

<T.Mesh {scale} {...props}>
  <T.BoxGeometry args={dim} />
  <T.MeshBasicMaterial color="hotpink" wireframe depthTest={true} visible={false} />
</T.Mesh>

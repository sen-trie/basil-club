<script>
  import { T } from "@threlte/core";

  let { dim, ...props } = $props();
</script>

<T.Mesh {...props}>
  <T.BoxGeometry args={dim} />
  <T.MeshBasicMaterial color="hotpink" wireframe depthTest={false} />
</T.Mesh>

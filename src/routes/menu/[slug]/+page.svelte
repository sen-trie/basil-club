<script lang="ts">
  let { data } = $props();
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>

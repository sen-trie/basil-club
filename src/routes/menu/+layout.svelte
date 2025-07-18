<script>
  let { children } = $props();
  import Header from "$lib/components/Header.svelte";
</script>

<Header />
<div>
  {@render children()}
</div>

<style>
  div {
    padding: 25px;
  }
</style>

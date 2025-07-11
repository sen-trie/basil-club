<script>
  import { changeFloor } from "$lib/stores/sceneControls";

  let change = () => {};
  changeFloor.subscribe((fn) => {
    change = fn;
  });
</script>

<div>
  <button
    class="bg-amber-50 cursor-pointer"
    onclick={() => {
      change(0);
    }}>Show All</button
  >
  <button
    class="bg-amber-50 cursor-pointer"
    onclick={() => {
      change(1);
    }}>Show Top</button
  >
  <button
    class="bg-amber-50 cursor-pointer"
    onclick={() => {
      change(2);
    }}>Show Bottom</button
  >
</div>

<style>
</style>

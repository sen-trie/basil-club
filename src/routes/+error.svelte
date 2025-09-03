<script>
  import { page } from "$app/state";
</script>

<div class="flexbox">
  <h1>404</h1>
  <h2>{page.error.message}</h2>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
  }

  h1,
  h2 {
    width: fit-content;
    margin: 0 auto;
  }
</style>

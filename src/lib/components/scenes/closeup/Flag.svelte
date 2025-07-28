<script>
  import { onMount } from "svelte";

  const categories = [
    { name: "Drinks", items: ["Water", "Tea", "Coffee"] },
    {
      name: "Appetizers",
      items: ["Wings", "Nachos", "Fries", "Nachos", "Fries"],
    },
    { name: "Mains", items: ["Burger", "Pasta", "Steak", "Pasta", "Steak"] },
    { name: "Desserts", items: ["Cake", "Ice Cream", "Pie"] },
  ];

  let refs = $state({});
  let current = $state(categories[0].name);
  let orderBox = $state(null);

  function scrollToCategory(name) {
    refs[name]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) current = e.target.dataset.name;
        });
      },
      { root: orderBox, threshold: 0.5 },
    );

    categories.forEach((cat) => {
      const element = refs[cat.name];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  });
</script>

<div class="flag-wrapper flexbox">
  <div class="flag-tablet order-ui">
    <div class="order-header">
      <p>Menu</p>
      <nav class="navbar">
        {#each categories as cat}
          <button
            class:selected={current === cat.name}
            onclick={() => scrollToCategory(cat.name)}
          >
            {cat.name}
          </button>
        {/each}
      </nav>
    </div>
    <div class="order-box" bind:this={orderBox}>
      {#each categories as cat}
        <section bind:this={refs[cat.name]} data-name={cat.name}>
          <h2>{cat.name}</h2>
          {#each cat.items as item}
            <div class="food-box">{item}</div>
          {/each}
        </section>
      {/each}
    </div>
  </div>
</div>

<style>
  :root {
    --padding-v: 70px;
    --padding-h: 35px;
  }

  .flag-wrapper {
    position: relative;
    bottom: 5%;
    width: 95%;
    height: 85%;
  }

  .flag-tablet {
    position: absolute;
    inset: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 2 / 3;
    border: 3px solid #949494;
    border-radius: var(--padding-h);
    background-color: wheat;
    padding: var(--padding-v) var(--padding-h);
    overflow: hidden;
  }

  .flag-tablet::before {
    background: none;
    border: var(--padding-h) solid #0e0d0d;
    border-top-width: var(--padding-v);
    border-bottom-width: var(--padding-v);
    border-radius: calc(var(--padding-h) - 3px);
    content: "";
    display: block;
    position: absolute;
    pointer-events: none;
    inset: 0;
  }

  .order-ui {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .order-header {
    background-color: black;
    padding: 1rem;
    color: white;
  }

  .navbar button {
    color: white;
    margin-right: 1rem;
  }

  .navbar button.selected {
    color: white;
    font-weight: bold;
    border-bottom: 2px solid white;
  }

  .order-box {
    flex-grow: 1;
    overflow-y: auto;
  }

  .food-box {
    padding: 42px;
    border: 1px solid #ccc;
    margin-bottom: 8px;
  }

  h2,
  div {
    color: black;
  }
</style>

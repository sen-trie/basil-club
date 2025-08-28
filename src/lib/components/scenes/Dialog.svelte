<script>
  import { fly } from "svelte/transition";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();

  const dialogObj = {
    "bear-sign": "A low growl can be heard from the café.",
    "men": "The men's restroom is currently unavailable. Come back later.",
    "photo": "Try clicking on the artworks at the top floor!",
    "grid": "Try clicking on the photo grid at the top floor!",
    "earl-street": "Try clicking on the display inside the staircase!",
    "fToilet": "The restroom doors at the bottom floor might be interactive!",
    "mToilet": "The restroom doors at the bottom floor might be interactive!",
    "bear": "A particular animal sign outside the café seems to be interactive!",
    "flag": "Take a seat at the bottom floor!",
    "eat": "Try ordering a meal after having a seat!",
    "payment": "After ordering, try paying for your meal!",
    "blackjack": "Try ordering a lot of food, then run out of credits to pay!",
    "allfound": "Congratulations! You have found all the interactables!",
    "starting":
      "Welcome! Take your time to explore the café, there are many interactables scattered about!",
  };

  let dialogTimer = null;

  const startTimer = () => {
    if (dialogTimer) {
      clearTimeout(dialogTimer);
    }
    dialogTimer = setTimeout(
      () => {
        scene.closeDialog();
      },
      scene.currentState.showDialog !== "starting" ? 4000 : 12000,
    );
  };

  $effect(() => {
    if (scene.currentState.showDialog !== null) {
      startTimer();
    } else if (dialogTimer) {
      clearTimeout(dialogTimer);
      dialogTimer = null;
    }

    return () => {
      if (dialogTimer) {
        clearTimeout(dialogTimer);
      }
    };
  });
</script>

{#if scene.currentState.showDialog !== null}
  <button
    class="dialog"
    class:f-toilet={scene.currentState.scene === "fToilet"}
    class:m-toilet={scene.currentState.scene === "mToilet"}
    transition:fly={{ y: 150, duration: 450 }}
    onclick={() => {
      if (dialogTimer) {
        clearTimeout(dialogTimer);
        dialogTimer = null;
      }
      scene.closeDialog();
    }}
  >
    <p>
      {dialogObj[scene.currentState.showDialog]}
    </p>
  </button>
{/if}

<style>
  .dialog {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    width: min(600px, 90%);
    translate: -50% 0;
    padding: 1rem 1.5rem;
    font-size: 1.6rem;
    line-height: 2rem;
    color: var(--colour-light);
    background: var(--colour-black);
    border: 2px solid var(--colour-dark);
    border-radius: 20px;
    z-index: 3;
    cursor: pointer;
    transition: all var(--trans-time) ease;
  }

  .f-toilet {
    background: var(--ftoilet-dark);
    border-color: var(--ftoilet-light);
  }

  .m-toilet {
    background: var(--mtoilet-dark);
    border-color: var(--mtoilet-light);
  }

  @media (max-width: 768px) {
    .dialog {
      font-size: 1.2rem;
      padding: 0.5rem 1rem;
      line-height: 1.5rem;
    }
  }
</style>

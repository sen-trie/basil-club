<script>
  import { fly } from "svelte/transition";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();

  const dialogObj = {
    "bear": "A low growl can be heard from the café.",
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
    "blackjack": "After ordering too much food, try paying for your meal!",
    "allfound": "Congratulations! You have found all the interactables!",
  };

  let dialogTimer = null;

  const startTimer = () => {
    if (dialogTimer) {
      clearTimeout(dialogTimer);
    }
    dialogTimer = setTimeout(() => {
      scene.closeDialog();
    }, 6000);
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
    width: min(500px, 90%);
    translate: -50% 0;
    padding: 1rem 1.5rem;
    font-size: 1.6rem;
    line-height: 2rem;
    background: var(--colour-black);
    color: var(--colour-light);
    border: 2px solid var(--colour-dark);
    border-radius: 20px;
    z-index: 3;
    cursor: pointer;
  }
</style>

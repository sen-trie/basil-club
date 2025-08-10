<script>
  import { fly, fade } from "svelte/transition";

  let { exitGame } = $props();

  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const defaultBet = 100;

  let credits = $state(1111000);

  function createDeck() {
    let deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  }

  function cardValue(card) {
    if (["J", "Q", "K"].includes(card.rank)) return 10;
    if (card.rank === "A") return 11;
    return +card.rank;
  }

  function handValue(cards) {
    let sum = 0,
      aces = 0;
    for (const c of cards) {
      sum += cardValue(c);
      if (c.rank === "A") aces++;
    }
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  }

  function canSplit(hand) {
    return (
      hand && hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank && !hand.hasSplit
    );
  }

  let deck = $state([]);
  let hands = $state([{ cards: [], isFinished: false, hasSplit: false }]);
  let dealer = $state({ cards: [], isFinished: false });
  let currentHandIndex = $state(0);
  let message = $state("");
  let gameOver = $state(true);

  const handDrawTime = 300;
  const delay = () => new Promise((r) => setTimeout(r, handDrawTime));

  async function startGame() {
    credits -= defaultBet;
    message = "";
    gameOver = false;

    do {
      deck = createDeck();
      const cards = [deck.pop(), deck.pop(), deck.pop(), deck.pop()]; // p1, p2, d1, d2

      hands = [{ cards: [], isFinished: false, hasSplit: false }];
      dealer = { cards: [], isFinished: false };

      if (handValue(cards.slice(0, 2)) === 21 || handValue(cards.slice(2)) === 21) continue;

      const sequence = [
        () => hands[0].cards.push(cards[0]),
        () => dealer.cards.push(cards[2]),
        () => hands[0].cards.push(cards[1]),
        () => dealer.cards.push(cards[3]),
      ];

      for (const action of sequence) {
        await delay();
        action();
      }
      break;
    } while (true);

    currentHandIndex = 0;
  }

  async function splitHand() {
    if (!canSplit(hands[currentHandIndex])) return;

    credits -= defaultBet;

    const handToSplit = hands[currentHandIndex];
    const card1 = handToSplit.cards[0];
    const card2 = handToSplit.cards[1];

    const newHand1 = { cards: [card1], isFinished: false, hasSplit: true };
    const newHand2 = { cards: [card2], isFinished: false, hasSplit: true };
    hands.splice(currentHandIndex, 1, newHand1, newHand2);

    const newCard1 = deck.pop();
    const newCard2 = deck.pop();

    const sequence = [
      () => hands[currentHandIndex].cards.push(newCard1),
      () => hands[currentHandIndex + 1].cards.push(newCard2),
    ];

    for (const action of sequence) {
      await delay();
      action();
    }
  }

  function hit() {
    if (gameOver) return;
    const hand = hands[currentHandIndex];
    if (hand.isFinished) return;

    hand.cards.push(deck.pop());
    if (handValue(hand.cards) >= 21) {
      hand.isFinished = true;
      nextHand();
    }
  }

  function canDoubleDown(hand) {
    return hand && hand.cards.length === 2 && !hand.isFinished && !gameOver;
  }

  function doubleDown() {
    if (!canDoubleDown(hands[currentHandIndex])) return;
    credits -= defaultBet;

    const hand = hands[currentHandIndex];
    hand.cards.push(deck.pop());
    hand.isFinished = true;
    nextHand();
  }

  function stand() {
    if (gameOver) return;
    hands[currentHandIndex].isFinished = true;
    nextHand();
  }

  function nextHand() {
    if (currentHandIndex + 1 < hands.length) {
      currentHandIndex++;
    } else {
      dealerPlay();
    }
  }

  async function dealerPlay() {
    while (handValue(dealer.cards) < 17) {
      dealer.cards.push(deck.pop());
      await new Promise((r) => setTimeout(r, handDrawTime));
    }
    dealer.isFinished = true;
    gameOver = true;

    for (const hand of hands) {
      const result = handText(hand.cards);
      if (result.includes("Win")) credits += defaultBet * 2;
      else if (result.includes("Push")) credits += defaultBet;
    }
  }

  function handText(handCards) {
    if (!gameOver) return "";

    const score = handValue(handCards);
    const dealerScore = handValue(dealer.cards);
    if (score > 21) {
      return " Bust!";
    } else if (dealerScore > 21 || score > dealerScore) {
      return " Win!";
    } else if (score === dealerScore) {
      return " Push.";
    } else {
      return " Lose...";
    }
  }
</script>

{#snippet cardDiv(rank, suit, cardback = false)}
  <div class="card-container" transition:fly={{ x: 75, duration: handDrawTime }}>
    <div
      class="card"
      class:back={cardback}
      style="background-position: 
        {(ranks.indexOf(rank) * 100) / 12}% 
        {suits.indexOf(suit) === 0 ? -0.07 : (suits.indexOf(suit) * 100) / 3}%;"
    ></div>
  </div>
{/snippet}

<div class="blackjack-container">
  <h2>Dealer</h2>
  <div class="card-deck">
    <div class="card-hand">
      {#if !gameOver || handValue(dealer.cards) > 0}
        <span transition:fade={{ delay: handDrawTime * 2, duration: 300 }}>
          ({dealer.isFinished ? handValue(dealer.cards) : "?"})
          {handValue(dealer.cards) > 21 ? " Bust!" : ""}
        </span>
      {/if}
      {#each dealer.cards as card, i}
        {@render cardDiv(card.rank, card.suit, !(i === 0 || dealer.isFinished))}
      {/each}
    </div>
  </div>

  <h2>Player Hands</h2>
  <div class="card-deck">
    {#key hands}
      {#each hands as hand, index}
        <div
          class="card-hand"
          class:dim={hands.length > 1 && !gameOver && index !== currentHandIndex}
          transition:fly={{ x: 75, duration: handDrawTime }}
        >
          {#if !gameOver || handValue(dealer.cards) > 0}
            <span transition:fade={{ delay: handDrawTime, duration: 300 }}>
              ({handValue(hand.cards)})
              {handText(hand.cards)}
            </span>
          {/if}
          {#each hand.cards as card}
            {@render cardDiv(card.rank, card.suit)}
          {/each}
        </div>
      {/each}
    {/key}
  </div>
  <div class="credits-display">
    Credits: {credits}
  </div>
</div>
<!-- <p class="message-container">{message}</p> -->

<div class="button-container">
  {#if !gameOver}
    <button onclick={hit} disabled={hands[currentHandIndex]?.isFinished}>Hit</button>
    <button onclick={stand} disabled={hands[currentHandIndex]?.isFinished}>Stand</button>
    <button onclick={doubleDown} disabled={!canDoubleDown(hands[currentHandIndex])}>Double</button>
    <button onclick={splitHand} disabled={!canSplit(hands[currentHandIndex])}>Split</button>
  {:else}
    {#if credits > 0}
      <button class="play-button" onclick={startGame}>Deal</button>
    {:else}
      <button class="play-button" disabled>Insufficient Credits</button>
    {/if}
    <button class="play-button" onclick={exitGame}>Exit</button>
  {/if}
</div>

<style>
  .blackjack-container {
    display: flex;
    flex-direction: column;
    position: relative;
    flex-grow: 1;
    padding: 8px 12px 8px;
    gap: 10px;
    overflow: hidden;
  }

  .credits-display {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 1.3rem;
    background: rgba(0, 0, 0, 0.6);
    padding: 6px 10px;
    border-radius: 8px;
    color: white;
    z-index: 10;
  }

  .button-container {
    height: fit-content;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 6px;
  }

  .button-container button {
    font-size: 1.3rem;
    background-color: white;
    margin: 4px;
    border-radius: 10px;
    padding: 10px 12px;
    pointer-events: all;
  }

  .play-button {
    grid-column: span 2;
  }

  .play-button:disabled {
    pointer-events: none;
  }

  .card-deck {
    width: 100%;
    height: 27.5%;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .card-deck:has(> :nth-child(2):last-child) {
    height: 55%;
  }

  .card-hand {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .card-hand.dim {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .card-hand.dim .card {
    filter: brightness(0.7);
  }

  .card-hand + .card-hand,
  .card-hand:first-child:nth-last-child(2) {
    height: 50%;
  }

  .card-container {
    height: 100%;
    aspect-ratio: 4 / 5.4;
    container-type: inline-size;
    margin-right: -100px;
  }

  span {
    position: absolute;
    left: 10px;
    bottom: 10px;
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 3px 6px;
    border-radius: 10px;
    font-size: 1.4rem;
    z-index: 5;
  }

  .card {
    width: 100%;
    height: 100%;
    background-image: url("textures/cards.webp");
    background-size: 1300%;
    background-repeat: no-repeat;
    transition: 0.3s filter ease;
  }

  .back {
    filter: brightness(0);
  }
</style>

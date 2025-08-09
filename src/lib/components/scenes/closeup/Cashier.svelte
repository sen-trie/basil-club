<script>
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

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
    return hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank && !hand.hasSplit;
  }

  let deck = $state([]);
  let dealer = $state({ cards: [], isFinished: false });
  let hands = $state([]);
  let currentHandIndex = $state(0);
  let message = $state("");
  let gameOver = $state(false);

  function startGame() {
    do {
      deck = createDeck();
      dealer = { cards: [], isFinished: false };
      hands = [
        {
          cards: [deck.pop(), deck.pop()],
          isFinished: false,
          hasSplit: false,
        },
      ];
      dealer.cards.push(deck.pop());
      dealer.cards.push(deck.pop());
    } while (handValue(hands[0].cards) === 21 || handValue(dealer.cards) === 21);

    currentHandIndex = 0;
    message = "";
    gameOver = false;
  }

  function splitHand() {
    if (!canSplit(hands[currentHandIndex])) return;

    const handToSplit = hands[currentHandIndex];
    const card1 = handToSplit.cards[0];
    const card2 = handToSplit.cards[1];

    hands.splice(
      currentHandIndex,
      1,
      { cards: [card1, deck.pop()], isFinished: false, hasSplit: true },
      { cards: [card2, deck.pop()], isFinished: false, hasSplit: true },
    );
  }

  function hit() {
    if (gameOver) return;
    const hand = hands[currentHandIndex];
    if (hand.isFinished) return;

    hand.cards.push(deck.pop());
    if (handValue(hand.cards) > 21) {
      hand.isFinished = true;
      nextHand();
    }
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

  function dealerPlay() {
    while (handValue(dealer.cards) < 17) {
      dealer.cards.push(deck.pop());
    }
    dealer.isFinished = true;
    calculateResults();
    gameOver = true;
  }

  function calculateResults() {
    const dealerScore = handValue(dealer.cards);
    message = "";

    hands.forEach((hand, i) => {
      const score = handValue(hand.cards);
      if (score > 21) {
        message += `Hand ${i + 1}: Bust! `;
      } else if (dealerScore > 21 || score > dealerScore) {
        message += `Hand ${i + 1}: Win! `;
      } else if (score === dealerScore) {
        message += `Hand ${i + 1}: Push. `;
      } else {
        message += `Hand ${i + 1}: Lose. `;
      }
    });
  }

  startGame();
</script>

<div class="container">
  <h2>Dealer</h2>
  <div class="card-hand">
    {#each dealer.cards as card, i}
      <div class="card-container">
        {#if i === 0 || dealer.isFinished}
          <div
            class="card"
            style="
        background-position: {(ranks.indexOf(card.rank) * 100) / 12}% {(suits.indexOf(card.suit) *
              100) /
              3}%;
      "
          ></div>
        {:else}
          <div class="card back"></div>
        {/if}
      </div>
    {/each}
    <span> ({dealer.isFinished ? handValue(dealer.cards) : "?"})</span>
  </div>

  <h2>Player Hands</h2>
  <div class="card-deck">
    {#each hands as hand, hIndex}
      <div class="card-hand">
        {#each hand.cards as card}
          <div class="card-container">
            <div
              class="card"
              style="background-position:
                    {(ranks.indexOf(card.rank) * 100) / 12}% {(suits.indexOf(card.suit) * 100) /
                3}%;"
            ></div>
          </div>
        {/each}
        <span>({handValue(hand.cards)})</span>
      </div>
    {/each}
  </div>

  {#if !gameOver}
    <button onclick={hit} disabled={hands[currentHandIndex]?.isFinished}>Hit</button>
    <button onclick={stand} disabled={hands[currentHandIndex]?.isFinished}>Stand</button>
    <button onclick={splitHand} disabled={!canSplit(hands[currentHandIndex])}>Split</button>
  {/if}

  <button onclick={startGame}>Restart</button>

  <p>{message}</p>

  <!-- <div class="card-container">
    <div class="card" style="background-position: {(rank * 100) / 12}% {(suit * 100) / 3}%;"></div>
  </div> -->
</div>

<style>
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    border: 2px solid #333;
    color: #333;
    padding: 10px;
    background: white;
    font-family: monospace;
    user-select: none;
    width: 850px;
    height: 800px;
  }

  span {
    margin-right: 6px;
    font-size: 1.2em;
  }

  button {
    margin: 4px;
    padding: 6px 12px;
    font-size: 1em;
    pointer-events: all;
    z-index: 999;
  }

  .card-deck {
    width: 100%;
    height: auto;
  }

  .card-hand {
    width: 100%;
    height: calc(160px * 5.4 / 4);
    display: flex;
    flex-direction: row;
  }

  .card-container {
    width: 160px;
    aspect-ratio: 4 / 5.4;
    overflow: hidden;
  }

  .card {
    width: 100%;
    height: 100%;
    background-image: url("textures/cards.webp");
    background-size: 1300%;
    background-repeat: no-repeat;
  }

  .back {
    filter: brightness(0);
  }
</style>

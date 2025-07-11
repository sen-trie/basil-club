<script>
  let isMuted = $state(false);

  let audioBGM = $state(null);
  let audioFound = $state(null);
  let audioVictory = $state(null);

  export const playBGM = () => {
    if (audioBGM) {
      audioBGM.currentTime = 0;
      audioBGM.play();
    }
  };

  export const stopBGM = () => {
    if (audioBGM) {
      audioBGM.pause();
    }
  };

  export const playFound = () => {
    if (audioFound) {
      audioFound.currentTime = 0;
      audioFound.play();
    }
  };

  export const playVictory = () => {
    if (audioVictory) {
      audioVictory.currentTime = 0;
      audioVictory.play();
    }
  };
</script>

<audio muted={isMuted} bind:this={audioBGM} preload="auto">
  <source src="audios/bgm.mp3" type="audio/mpeg" />
</audio>
<audio muted={isMuted} bind:this={audioFound} preload="auto">
  <source src="audios/found.mp3" type="audio/mpeg" />
</audio>
<audio muted={isMuted} bind:this={audioVictory} preload="auto">
  <source src="audios/victory.mp3" type="audio/mpeg" />
</audio>

<button
  onclick={() => {
    isMuted = !isMuted;
  }}
>
  Mute
</button>

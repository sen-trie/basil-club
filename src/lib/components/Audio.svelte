<script>
  import { base } from "$app/paths";
  import { Sound } from "svelte-sound";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();

  const audio = {
    eat: new Sound(`${base}/audio/eat.mp3`),
    bgm: new Sound(`${base}/audio/bgm.mp3`),
    bgmF: new Sound(`${base}/audio/bgm-f.mp3`),
    bgmM: new Sound(`${base}/audio/bgm-m.mp3`),
    bear: new Sound(`${base}/audio/bear.mp3`),
    orderConfirmed: new Sound(`${base}/audio/order-confirmed.mp3`),
    paymentSuccess: new Sound(`${base}/audio/payment-success.mp3`),
    paymentUnsucess: new Sound(`${base}/audio/payment-unsucess.mp3`),
  };

  let currentBGM = audio.bgm;
  export const playBGM = () => {
    if (!currentBGM.howl.playing()) {
      currentBGM.howl.loop(true);
      currentBGM.play();
    }
  };

  export const playSound = (sfx) => {
    const sound = audio[sfx];
    if (sound) {
      if (sound.howl.playing()) {
        sound.howl.stop();
      }

      sound.howl.loop(false);
      sound.play();
    }
  };

  const crossFadeDuration = 2000;
  export const swapBGM = (target) => {
    const newBGM = audio[target];
    if (!newBGM || newBGM === currentBGM) return;

    const seekPos = currentBGM.howl.seek();

    newBGM.play();
    newBGM.howl.loop(true);
    newBGM.howl.seek(seekPos);
    newBGM.howl.volume(0);

    currentBGM.howl.fade(currentBGM.howl.volume(), 0, crossFadeDuration);
    newBGM.howl.fade(0, 1, crossFadeDuration);

    setTimeout(() => {
      currentBGM.stop();
      currentBGM = newBGM;
    }, crossFadeDuration);
  };

  export const pauseBGM = () => {
    if (currentBGM.howl.playing()) {
      currentBGM.howl.pause();
    }
  };

  export const resumeBGM = () => {
    if (!currentBGM.howl.playing()) {
      currentBGM.howl.play();
    }
  };

  export const muteAudio = () => {
    Object.values(audio).forEach((s) => s.howl.mute(scene.currentState.muted));
  };

  $effect(() => {
    return () => {
      if (currentBGM.howl.playing()) {
        currentBGM.destroy();
      }
    };
  });
</script>

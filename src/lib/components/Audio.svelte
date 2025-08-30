<script>
  import { Howl } from "howler";
  import { base } from "$app/paths";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();

  let { pageStarted } = $props();

  const audio = {
    eat: new Howl({ src: [`${base}/audio/eat.mp3`] }),
    bgm: new Howl({ src: [`${base}/audio/bgm.mp3`] }),
    bgmF: new Howl({ src: [`${base}/audio/bgm-f.mp3`] }),
    bgmM: new Howl({ src: [`${base}/audio/bgm-m.mp3`] }),
    bear: new Howl({ src: [`${base}/audio/bear.mp3`] }),
    orderConfirmed: new Howl({ src: [`${base}/audio/order-confirmed.mp3`] }),
    paymentSuccess: new Howl({ src: [`${base}/audio/payment-success.mp3`] }),
    paymentUnsucess: new Howl({ src: [`${base}/audio/payment-unsucess.mp3`] }),
  };

  let currentBGM = audio.bgm;

  export const playBGM = () => {
    if (!currentBGM.playing()) {
      currentBGM.loop(true);
      currentBGM.play();
    }
  };

  export const playSound = (sfx) => {
    const sound = audio[sfx];
    if (sound) {
      if (sound.playing()) {
        sound.stop();
      }
      sound.loop(false);
      sound.play();
    }
  };

  const crossFadeDuration = 2000;
  export const swapBGM = (target) => {
    const newBGM = audio[target];
    if (!newBGM || newBGM === currentBGM) return;

    const seekPos = currentBGM.seek();

    newBGM.play();
    newBGM.loop(true);
    newBGM.seek(seekPos);
    newBGM.volume(0);

    currentBGM.fade(currentBGM.volume(), 0, crossFadeDuration);
    newBGM.fade(0, 1, crossFadeDuration);

    setTimeout(() => {
      currentBGM.stop();
      currentBGM = newBGM;
    }, crossFadeDuration);
  };

  export const pauseBGM = () => {
    if (currentBGM.playing()) {
      currentBGM.pause();
    }
  };

  export const resumeBGM = () => {
    if (!currentBGM.playing()) {
      currentBGM.play();
    }
  };

  export const muteAudio = () => {
    Object.values(audio).forEach((sound) => sound.mute(scene.currentState.muted));
  };

  const suspendAudio = () => {
    if (!pageStarted) {
      return;
    }

    if (document.visibilityState === "visible") {
      if (Howler.ctx.state === "suspended") {
        Howler.ctx.resume();
      }

      if (!currentBGM.playing()) {
        currentBGM.play();
      }
    } else {
      if (currentBGM.playing()) {
        currentBGM.pause();
      }
    }
  };
</script>

<svelte:document onvisibilitychange={suspendAudio} />

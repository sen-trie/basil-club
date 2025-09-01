<script>
  import { Howl } from "howler";
  import { base } from "$app/paths";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();

  let { pageStarted } = $props();

  const createHowl = (src) => {
    const config = { src: [`${base}/audio/${src}`], preload: true };
    return new Howl(config);
  };

  const audio = {
    eat: createHowl("eat.mp3"),
    bgm: createHowl("bgm.mp3"),
    bgmF: createHowl("bgm-f.mp3"),
    bgmM: createHowl("bgm-m.mp3"),
    bear: createHowl("bear.mp3"),
    orderConfirmed: createHowl("order-confirmed.mp3"),
    paymentSuccess: createHowl("payment-success.mp3"),
    paymentUnsucess: createHowl("payment-unsucess.mp3"),
  };

  let currentBGM = audio.bgm;

  export const playBGM = () => {
    if (!currentBGM.playing()) {
      currentBGM.loop(true);
      currentBGM.play();
      updateMediaSession();
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
      updateMediaSession();
    }, crossFadeDuration);
  };

  export const pauseBGM = () => {
    if (currentBGM.playing()) {
      currentBGM.pause();
      updateMediaSession();
    }
  };

  export const resumeBGM = () => {
    if (!currentBGM.playing()) {
      currentBGM.play();
      updateMediaSession();
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

  function updateMediaSession() {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Idolatrize World (Chill Café Mix)",
      artist: "Basil Club",
      artwork: [{ src: `${base}/textures/full.webp`, type: "image/webp" }],
    });
  }
</script>

<svelte:document onvisibilitychange={suspendAudio} />

<script>
  import { Sound } from "svelte-sound";
  import { getContext } from "svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";

  const scene = getScene();

  const sounds = getContext("audios");
  const bgm = new Sound(sounds["bgm.mp3"]);

  export const playBGM = () => {
    if (!bgm.howl.playing()) {
      bgm.howl.loop(true);
      bgm.play();
    }
  };

  export const muteAudio = () => {
    bgm.howl.mute(scene.currentState.muted);
  };
</script>

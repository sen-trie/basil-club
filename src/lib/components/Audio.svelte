<script>
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { getContext } from "svelte";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  const scene = getScene();

  let { gameStarted } = $props();

  let audioCtx;
  let gainNode;
  let isAudioContextReady = false;

  let bgmBuffer = null;
  let bgmSource = null;
  let bgmOffset = 0;
  let bgmStartTime = 0;

  const audios = getContext("audios");

  async function initAudioContext() {
    if (audioCtx && audioCtx.state === "suspended") {
      try {
        await audioCtx.resume();
        isAudioContextReady = true;
      } catch (error) {
        isAudioContextReady = false;
      }
    } else if (audioCtx && audioCtx.state === "running") {
      isAudioContextReady = true;
    }
  }

  async function fetchAndDecode(url) {
    try {
      const res = await fetch(audios[url]);
      const arrayBuffer = await res.arrayBuffer();
      return await audioCtx.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error(`Error loading audio from ${url}:`, error);
      return null;
    }
  }

  async function playBuffer(buffer, loop = false, offset = 0) {
    if (!buffer || !audioCtx) {
      console.warn("Cannot play audio - missing buffer or AudioContext");
      return null;
    }

    let retryCount = 0;
    const maxRetries = 10;
    while (audioCtx.state !== "running" && retryCount < maxRetries) {
      if (audioCtx.state === "suspended") {
        try {
          await audioCtx.resume();
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.warn("Failed to resume AudioContext:", error);
        }
      }

      retryCount++;
      if (audioCtx.state !== "running") {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    if (audioCtx.state !== "running") {
      console.warn("AudioContext still not ready after retries");
      return null;
    }

    try {
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;

      if (gainNode) {
        source.connect(gainNode);
      } else {
        source.connect(audioCtx.destination);
      }

      const clampedOffset = Math.min(offset, buffer.duration);
      source.start(0, clampedOffset);
      return source;
    } catch (error) {
      console.error("Error playing buffer:", error);
      return null;
    }
  }

  export const playBGM = async () => {
    if (!bgmBuffer) {
      return;
    }

    stopBGM();
    bgmOffset = 0;
    bgmSource = await playBuffer(bgmBuffer, true);
    if (bgmSource) {
      bgmStartTime = audioCtx.currentTime;
    }
  };

  export const stopBGM = () => {
    if (bgmSource) {
      try {
        bgmSource.stop();
        bgmSource.disconnect();
      } catch (error) {
        console.warn("Error stopping BGM:", error);
      }
      bgmSource = null;
    }
  };

  const handleVisibility = async () => {
    if (!browser) return;

    if (document.hidden) {
      if (bgmSource && bgmBuffer) {
        try {
          const elapsed = audioCtx.currentTime - bgmStartTime;
          bgmOffset += elapsed % bgmBuffer.duration;
          stopBGM();
        } catch (error) {
          console.warn("Error handling visibility change:", error);
        }
      }
    } else {
      if (audioCtx && audioCtx.state === "suspended") {
        await initAudioContext();
      }

      if (gameStarted && bgmBuffer && isAudioContextReady) {
        const clampedOffset = bgmOffset % bgmBuffer.duration;
        bgmSource = await playBuffer(bgmBuffer, true, clampedOffset);
        if (bgmSource) {
          bgmStartTime = audioCtx.currentTime;
        }
      }
    }
  };

  const handleUserInteraction = async () => {
    if (!browser) return;
    if (audioCtx && audioCtx.state === "suspended") {
      await initAudioContext();
    }
  };

  $effect(() => {
    let targetValue = 0;
    if (!scene.currentState.muted) {
      targetValue = 1;
    }

    if (gainNode) {
      try {
        gainNode.gain.setValueAtTime(targetValue, audioCtx.currentTime);
      } catch (error) {
        console.warn("Error setting gain value:", error);
        gainNode.gain.value = scene.currentState.muted ? 0 : 1;
      }
    }
  });

  onMount(async () => {
    if (!browser) return;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);

      const initialGain = scene.currentState.muted ? 0 : 1;
      gainNode.gain.setValueAtTime(initialGain, audioCtx.currentTime);

      document.addEventListener("touchstart", handleUserInteraction, {
        once: false,
        passive: false,
      });
      document.addEventListener("click", handleUserInteraction, {
        once: false,
        passive: false,
      });
      document.addEventListener("touchend", handleUserInteraction, {
        once: false,
        passive: false,
      });

      document.addEventListener("visibilitychange", handleVisibility);

      const [bgm] = await Promise.allSettled([fetchAndDecode("bgm.mp3")]);

      bgmBuffer = bgm.status === "fulfilled" ? bgm.value : null;

      if (audioCtx.state === "running") {
        isAudioContextReady = true;
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  });

  onDestroy(() => {
    if (!browser) return;

    stopBGM();

    document.removeEventListener("touchstart", handleUserInteraction);
    document.removeEventListener("click", handleUserInteraction);
    document.removeEventListener("touchend", handleUserInteraction);
    document.removeEventListener("visibilitychange", handleVisibility);

    if (audioCtx) {
      audioCtx.close();
    }
  });
</script>

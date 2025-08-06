import { showBlocker, audioRef } from "./sceneControls";
import { get } from "svelte/store";

let changeBlocker = () => {};
showBlocker.subscribe((fn) => {
  changeBlocker = fn;
});

let currentState = $state({
  muted: false,
  scene: "cafe",
  overlayType: "",
  showDialog: null,
  povCamera: false,
  hudControls: false,
  bearTouches: 0,
  currentFloor: 0,
  currentPlate: "",
  plateCount: 0,
  earlstreetClicked: false,
  interactables: {
    "photo": false,
    "grid": false,
    "earl-street": false,
    "fToilet": false,
    "mToilet": false,
    "bear": false,
    "flag": false,
    "eat": false,
  },
});

let interactableCount = $derived(Object.values(currentState.interactables).filter(Boolean).length);

let maxInteractables = $derived(Object.keys(currentState.interactables).length);
let sceneCooldown = 0;
const timeCooldown = 3000;

const eatAnimation = 4000;

export function getScene() {
  return {
    get currentState() {
      return currentState;
    },

    get countInteractables() {
      return interactableCount;
    },

    get eatTime() {
      return eatAnimation;
    },

    get maxInteractables() {
      return maxInteractables;
    },

    setInteractable(name) {
      currentState.interactables[name] = true;
    },

    setOverlay(nextOverlayType) {
      if (currentState.scene !== "cafe") return;
      if (this.currentState.hudControls) return;
      if (nextOverlayType !== "hud") {
        this.setInteractable(nextOverlayType);
      }

      // if (nextOverlayType === "bear") {
      //   const audioEl = get(audioRef);
      //   audioEl.pauseBGM();
      //   setTimeout(() => {
      //     audioEl.resumeBGM();
      //   }, 10000);
      // }

      currentState.overlayType = nextOverlayType;
    },

    closeOverlay() {
      if (currentState.overlayType === "hud") {
        currentState.hudControls = false;
      }
      currentState.overlayType = "";
    },

    openDialog(dialogBox) {
      currentState.showDialog = dialogBox;
    },

    closeDialog() {
      currentState.showDialog = null;
    },

    setFloor(newFloor) {
      if (currentState.hudControls) return;
      currentState.currentFloor = newFloor;
    },

    toggleAudio() {
      currentState.muted = !currentState.muted;

      const audioEl = get(audioRef);
      audioEl.playBGM();
      audioEl.muteAudio();
    },

    toggleHud() {
      if (currentState.scene !== "cafe") return;
      if (currentState.povCamera) return;
      this.setOverlay("hud");
      this.setInteractable("earl-street");

      currentState.hudControls = true;
    },

    togglePOVCamera() {
      if (currentState.scene !== "cafe") return;
      if (currentState.hudControls) return;
      const camCooldown = 500;

      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + camCooldown;
      changeBlocker();

      setTimeout(() => {
        currentState.povCamera = !currentState.povCamera;
        currentState.currentPlate = "";
      }, camCooldown);
    },

    setPlate(newDish) {
      currentState.currentPlate = newDish;
      currentState.plateCount += 1;
    },

    setCafe() {
      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + timeCooldown;
      currentState = { ...currentState, scene: "cafe" };
    },

    setMToilet() {
      if (currentState.hudControls || currentState.povCamera) return;
      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + timeCooldown;
      this.setInteractable("mToilet");
      currentState = { ...currentState, scene: "mToilet" };
    },

    setFToilet() {
      if (currentState.hudControls || currentState.povCamera) return;
      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + timeCooldown;
      this.setInteractable("fToilet");
      currentState = { ...currentState, scene: "fToilet" };
    },

    touchBear() {
      if (Date.now() < sceneCooldown) return null;
      sceneCooldown = Date.now() + timeCooldown / 3;
      currentState.bearTouches++;
      if (currentState.bearTouches < 5) {
        return false;
      } else {
        return true;
      }
    },

    clickEarlStreet() {
      currentState = { ...currentState, earlstreetClicked: true };
    },
  };
}

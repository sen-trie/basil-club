import { showBlocker } from "./sceneControls";

let changeBlocker = () => {};
showBlocker.subscribe((fn) => {
  changeBlocker = fn;
});

let currentState = $state({
  scene: "cafe",
  overlayType: "",
  povCamera: false,
  hudControls: false,
  bearTouches: 0,
  currentFloor: 0,
  earlstreetClicked: false,
  interactables: {
    "photo": false,
    "grid": false,
    "earl-street": false,
    "fToilet": false,
    "mToilet": false,
    "bear": false,
    "flag": false,
  },
});

let interactableCount = $derived(
  Object.values(currentState.interactables).filter(Boolean).length,
);

let maxInteractables = $derived(Object.keys(currentState.interactables).length);
let sceneCooldown = 0;
const timeCooldown = 3000;

export function getScene() {
  return {
    get currentState() {
      return currentState;
    },

    get countInteractables() {
      return interactableCount;
    },

    get maxInteractables() {
      return maxInteractables;
    },

    setInteractable(name) {
      currentState = {
        ...currentState,
        interactables: { ...currentState.interactables, [name]: true },
      };
    },

    setOverlay(nextOverlayType) {
      if (currentState.scene !== "cafe") return;
      if (this.currentState.hudControls) return;
      if (nextOverlayType !== "hud") {
        this.setInteractable(nextOverlayType);
      }

      currentState.overlayType = nextOverlayType;
    },

    closeOverlay() {
      if (currentState.overlayType === "hud") {
        currentState = {
          ...currentState,
          hudControls: false,
        };
      }
      currentState.overlayType = "";
    },

    setFloor(newFloor) {
      if (currentState.hudControls) return;
      currentState = { ...currentState, currentFloor: newFloor };
    },

    toggleHud() {
      if (currentState.scene !== "cafe") return;
      if (currentState.povCamera) return;
      this.setOverlay("hud");
      this.setInteractable("earl-street");

      currentState = {
        ...currentState,
        hudControls: true,
      };
    },

    togglePOVCamera() {
      if (currentState.scene !== "cafe") return;
      if (currentState.hudControls) return;
      const camCooldown = 500;

      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + camCooldown;
      changeBlocker();
      setTimeout(() => {
        currentState = { ...currentState, povCamera: !currentState.povCamera };
      }, camCooldown);
    },

    setCafe() {
      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + timeCooldown;
      currentState = { ...currentState, scene: "cafe" };
    },

    setMToilet() {
      if (currentState.hudControls) return;
      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + timeCooldown;
      this.setInteractable("mToilet");
      currentState = { ...currentState, scene: "mToilet" };
    },

    setFToilet() {
      if (currentState.hudControls) return;
      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + timeCooldown;
      this.setInteractable("fToilet");
      currentState = { ...currentState, scene: "fToilet" };
    },

    touchBear() {
      if (Date.now() < sceneCooldown) return null;
      sceneCooldown = Date.now() + timeCooldown / 3;
      currentState.bearTouches++;
      if (currentState.bearTouches < 3) {
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

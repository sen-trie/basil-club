import { showBlocker } from "./sceneControls";
import { get } from "svelte/store";
import { writable } from "svelte/store";
import { readable } from "svelte/store";

export const isMobile = readable(false, (set) => {
  const mql = typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)") : null;
  const update = () => set(!!mql?.matches);
  mql?.addEventListener("change", update);
  update();
  return () => mql?.removeEventListener("change", update);
});

let changeBlocker = () => {};
showBlocker.subscribe((fn) => {
  changeBlocker = fn;
});

export const audioRef = writable(null);

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
  credits: 1000,
  freeDeals: 3,
  foodOrders: [],
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
    "payment": false,
    "blackjack": false,
  },
});

let interactableCount = $derived(Object.values(currentState.interactables).filter(Boolean).length);
let maxInteractables = $derived(Object.keys(currentState.interactables).length);
let sceneCooldown = 0;
const timeCooldown = 3000;

const eatAnimation = 4000;

export const foodItems = {
  Pastries: {
    "Financier": { shortname: "financier", price: 3.5 },
    "Matcha Financier": { shortname: "matcha-financier", price: 3.8, soldout: true },
    "Matcha Muffin": { shortname: "matcha-muffin", price: 3.6 },
  },
  Cakes: {
    "Lava Cake": { shortname: "lava-cake", price: 6.5 },
    "Yuzu Molten Cake": { shortname: "yuzu-cake", price: 7.0, soldout: true },
    "Matcha Molten Cake": { shortname: "matcha-cake", price: 6.8 },
    "Cheesecake": { shortname: "cheesecake", price: 5.0 },
    "Earl Grey Basque Cheesecake": { shortname: "earlgrey-cheesecake", price: 5.2 },
    "Brownie Basque Cheesecake": { shortname: "brownie-cheesecake", price: 5.6 },
  },
  Custards: {
    "Crème Brûlée": { shortname: "cremebrulee", price: 4.8 },
    "Chocolate Crème Brûlée": { shortname: "choc-cremebrulee", price: 5.2 },
  },
};

export function findItemByName(itemName) {
  const lowerItemName = itemName.toLowerCase();

  for (const category of Object.values(foodItems)) {
    for (const [name, item] of Object.entries(category)) {
      if (name.toLowerCase() === lowerItemName || item.shortname === lowerItemName) {
        return item;
      }
    }
  }
  return null;
}

let foodPaid = $derived.by(() => {
  return currentState.foodOrders.reduce((acc, order) => {
    const item = findItemByName(order);
    return acc + (item ? item.price : 0);
  }, 0);
});

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

    get foodPaid() {
      return foodPaid;
    },

    setInteractable(name) {
      currentState.interactables[name] = true;
    },

    setOverlay(nextOverlayType) {
      if (currentState.scene !== "cafe") return;
      if (this.currentState.hudControls) return;

      if (currentState.showDialog) {
        this.closeDialog();
      }

      if (nextOverlayType !== "hud") {
        this.setInteractable(nextOverlayType);
      }

      if (nextOverlayType === "bear") {
        const audioEl = get(audioRef);
        audioEl.pauseBGM();
        setTimeout(() => {
          audioEl.resumeBGM();
        }, 10000);
      }

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

    rollDialog() {
      if (currentState.showDialog) return;
      if (interactableCount === maxInteractables) {
        this.openDialog("allfound");
      } else {
        const interactableKeys = Object.keys(currentState.interactables).filter(
          (key) => !currentState.interactables[key],
        );
        if (interactableKeys.length === 0) return;

        let randomKey;
        do {
          randomKey = interactableKeys[Math.floor(Math.random() * interactableKeys.length)];
        } while (randomKey === "bear" && !currentState.interactables["mToilet"]);
        this.openDialog(randomKey);
      }
    },

    closeDialog() {
      currentState.showDialog = null;
    },

    cycleFloor() {
      if (currentState.hudControls) return;

      if (currentState.currentFloor === 0) {
        currentState.currentFloor = 1;
      } else if (currentState.currentFloor === 1) {
        currentState.currentFloor = 2;
      } else {
        currentState.currentFloor = 0;
      }
    },

    toggleAudio() {
      currentState.muted = !currentState.muted;

      const audioEl = get(audioRef);
      audioEl.playBGM();
      audioEl.muteAudio();
    },

    playSound(soundName) {
      const audioEl = get(audioRef);
      audioEl.playSound(soundName);
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
      currentState.currentPlate = findItemByName(newDish)["shortname"];
      currentState.plateCount += 1;
      currentState.foodOrders.push(newDish);
    },

    setCafe() {
      if (Date.now() < sceneCooldown) return;
      sceneCooldown = Date.now() + timeCooldown;
      currentState = { ...currentState, scene: "cafe" };

      const audioEl = get(audioRef);
      audioEl.swapBGM("bgm");
    },

    setMToilet() {
      if (currentState.hudControls || currentState.povCamera) return;
      if (Date.now() < sceneCooldown) return;

      sceneCooldown = Date.now() + timeCooldown;
      this.setInteractable("mToilet");
      currentState = { ...currentState, scene: "mToilet" };

      const audioEl = get(audioRef);
      audioEl.swapBGM("bgmM");
    },

    setFToilet() {
      if (currentState.hudControls || currentState.povCamera) return;
      if (Date.now() < sceneCooldown) return;

      sceneCooldown = Date.now() + timeCooldown;
      this.setInteractable("fToilet");
      currentState = { ...currentState, scene: "fToilet" };

      const audioEl = get(audioRef);
      audioEl.swapBGM("bgmF");
    },

    touchBear() {
      if (Date.now() < sceneCooldown) return null;
      sceneCooldown = Date.now() + timeCooldown / 2;
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

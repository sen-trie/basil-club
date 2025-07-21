let currentState = $state({
  scene: "cafe",
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

    setCafe() {
      currentState = { ...currentState, scene: "cafe" };
    },

    setMToilet() {
      this.setInteractable("mToilet");
      currentState = { ...currentState, scene: "mToilet" };
    },

    setFToilet() {
      this.setInteractable("fToilet");
      currentState = { ...currentState, scene: "fToilet" };
    },
  };
}

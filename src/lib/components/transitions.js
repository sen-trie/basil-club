import { isInstanceOf } from "@threlte/core";
import { createTransition } from "@threlte/extras";
import { quadInOut } from "svelte/easing";
import { mapLinear } from "three/src/math/MathUtils.js";

export const fly = (options) => {
  return createTransition((ref) => {
    if (!isInstanceOf(ref, "Object3D")) return;

    return {
      duration: 3000,
      tick(t) {
        const x = mapLinear(t, 0, 1, options.x ?? 0, 0);
        const y = mapLinear(t, 0, 1, options.y ?? 0, 0);
        const z = mapLinear(t, 0, 1, options.z ?? 0, 0);
        ref.position.set(x, y, z);
      },
      easing: quadInOut,
    };
  });
};

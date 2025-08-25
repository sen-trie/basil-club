<script>
  import { T } from "@threlte/core";
  import { CameraControls } from "@threlte/extras";
  import { getScene } from "$lib/stores/worldState.svelte.js";
  import { onMount } from "svelte";

  const scene = getScene();
  let cameraControls = $state(null);
  let cameraRef = $state(null);
  let isMouseDown = false;
  let isTouchDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;
  const sensitivity = 0.001;

  function onMouseDown(e) {
    if (!scene.currentState.povCamera || scene.currentState.overlayType) return;
    isMouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }

  function onMouseUp(e) {
    if (!scene.currentState.povCamera || scene.currentState.overlayType) return;
    isMouseDown = false;
  }

  function onTouchStart(e) {
    if (!scene.currentState.povCamera || scene.currentState.overlayType) return;
    if (e.touches.length === 1) {
      isTouchDown = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    }
  }

  function onTouchEnd(e) {
    if (!scene.currentState.povCamera || scene.currentState.overlayType) return;
    isTouchDown = false;
  }

  function onTouchMove(e) {
    if (!scene.currentState.povCamera || scene.currentState.overlayType) return;
    if (!isTouchDown || !cameraControls || e.touches.length !== 1) return;

    e.preventDefault();
    const touch = e.touches[0];
    updateCamera(touch.clientX, touch.clientY, lastTouchX, lastTouchY);
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
  }

  function onMouseMove(e) {
    if (!scene.currentState.povCamera || scene.currentState.overlayType) return;
    if (!isMouseDown || !cameraControls) return;
    updateCamera(e.clientX, e.clientY, lastMouseX, lastMouseY);
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }

  function updateCamera(currentX, currentY, lastX, lastY) {
    const deltaX = (currentX - lastX) * sensitivity;
    const deltaY = (currentY - lastY) * sensitivity;

    const target = cameraControls.getTarget();
    const camera = cameraRef.position;

    let lookX = target.x - camera.x;
    let lookY = target.y - camera.y;
    let lookZ = target.z - camera.z;

    const distance = Math.sqrt(lookX * lookX + lookY * lookY + lookZ * lookZ);
    let yaw = Math.atan2(lookX, lookZ);
    let pitch = Math.asin(lookY / distance);

    yaw -= deltaX;
    pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch - deltaY));

    const newLookX = distance * Math.sin(yaw) * Math.cos(pitch);
    const newLookY = distance * Math.sin(pitch);
    const newLookZ = distance * Math.cos(yaw) * Math.cos(pitch);

    const newTargetX = camera.x + newLookX;
    const newTargetY = camera.y + newLookY;
    const newTargetZ = camera.z + newLookZ;

    const clampedX = Math.max(-1.2, Math.min(1.4, newTargetX));
    const clampedY = Math.max(-1.6, Math.min(-0.1, newTargetY));
    const clampedZ = Math.max(-1.2, Math.min(1.4, newTargetZ));

    cameraControls.setTarget(clampedX, clampedY, clampedZ, false);
  }

  onMount(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchmove", onTouchMove);
    };
  });
</script>

<T.PerspectiveCamera
  bind:ref={cameraRef}
  makeDefault={scene.currentState.povCamera}
  fov={40}
  position={[5.7, 0.35, 0.98]}
>
  <CameraControls
    bind:ref={cameraControls}
    mouseButtons={{
      left: 0, // disables rotate
      wheel: 0, // disables zoom
      middle: 0,
      right: 0,
    }}
    touches={{
      one: 0, // disables rotate
      two: 0, // disables zoom
    }}
    oncreate={(ref) => {
      ref.setTarget(0, -0.8, 0.1);
    }}
  />
</T.PerspectiveCamera>

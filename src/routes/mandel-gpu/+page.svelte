<script>
  import * as THREE from "three";
  import * as SC from "svelte-cubed";
  import fragmentShader from "./default.fsh?raw";
  import { onMount } from "svelte";

  let width, height;
  let mouse = [250, 200];
  let zoom = 1;
  let zoomMode = 1;

  const handleMouse = (() => {
    let p1 = null;

    return {
      scroll: (e) => {
        const dy = e.deltaY;
        zoomMode += dy / 250;
        if (Math.abs(zoomMode) < 0.7) zoomMode = 0;
      },

      down: (e) => {
        p1 = [e.x, e.y];
      },

      move: (e) => {
        if (!p1) return;
        const dx = e.x - p1[0];
        const dy = e.y - p1[1];
        mouse[0] -= dx / zoom;
        mouse[1] += dy / zoom;
        p1 = [e.x, e.y];
      },

      up: (e) => {
        p1 = null;
      },
    };
  })();

  $: material = new THREE.ShaderMaterial({
    uniforms: {
      size: {
        value: new THREE.Vector2(width, height),
      },
      t: {
        value: 0,
      },
      zoom: {
        value: zoom,
      },
      mouse: {
        value: mouse,
      },
    },
    fragmentShader: fragmentShader,
  });

  onMount(() => {
    let t0 = Date.now() / 1000;
    let tLast = t0;

    function frame() {
      const now = Date.now() / 1000;
      const time = now - t0;
      const dt = now - tLast;

      material.uniforms.t.value = time;
      zoom *= Math.pow(2, 0.3 * dt * zoomMode);
      material.uniforms.zoom.value = zoom;

      tLast = now;
      requestAnimationFrame(frame);
    }

    frame();
  });
</script>

<svelte:window
  on:mousewheel={handleMouse.scroll}
  on:mouseup={handleMouse.up}
  on:mousemove={handleMouse.move}
  on:mousedown={handleMouse.down}
  bind:innerWidth={width}
  bind:innerHeight={height}
/>

<SC.Canvas>
  <SC.Mesh geometry={new THREE.PlaneGeometry(2, 2)} {material} />
  <SC.OrthographicCamera />
</SC.Canvas>

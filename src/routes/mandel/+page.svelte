<script lang="ts">
  let width: number;
  let height: number;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  $: if (canvas && width) {
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d")!;
  }

  function draw(time) {
    function mandelbrott(cr, ci, a = 0, b = 0) {
      const zLimit = 6;
      const orbitLimit = 500;

      let z = [cr, ci];

      for (let orbit = 0; orbit < orbitLimit; orbit++) {
        // z^2 + c
        z = [
          z[0] ** 2 - z[1] ** 2 + cr + a * z[0],
          2 * z[0] * z[1] + ci + b * z[1],
        ];

        // if |z| > limit
        const zMag2 = z[0] * z[0] + z[1] * z[1];
        if (zMag2 > zLimit) {
          // diverged outside
          return orbit / 150;
        }
      }

      return 0;
    }

    const imageData = ctx.getImageData(0, 0, width, height);
    const scr = imageData.data;

    function pixel(x, y, rgb: number[]) {
      const index = (y * width + x) * 4;
      for (let i = 0; i < 3; i++) {
        scr[index + i] = rgb[i];
      }
      scr[index + 3] = 255;
    }

    function hsv2rgb(h, s, v) {
      let f = (n, k = (n + h / 60) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
      return [f(5), f(3), f(1)];
    }

    const scale = 5 / width;
    const xOff = -3;
    const yOff = -1.5;

    const a = 2 * Math.sin(time);
    const b = 2 * Math.sin(2 * time);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        const x0 = x * scale + xOff;
        const y0 = y * scale + yOff;

        const r = mandelbrott(x0, y0, a, b);
        const hue = Math.round(r * 360);
        const sat = 1000;
        const rgb = hsv2rgb(hue, sat, r * 1000);
        pixel(x, y, rgb);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  let time = 0;
  let speed = 0.1;
  function animate() {
    time++;
    draw(time * speed);
    requestAnimationFrame(animate);
  }

  $: if (ctx) animate();
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<canvas class="w-screen h-screen" bind:this={canvas}> </canvas>

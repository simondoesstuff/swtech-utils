<script>
  import * as THREE from "three";
  import * as SC from "svelte-cubed";
  import fragmentShader from "./default.fsh?raw";

  let width, height;

  $: material = new THREE.ShaderMaterial({
    uniforms: {
      size: {
        value: new THREE.Vector2(width, height),
      },
    },
    fragmentShader: fragmentShader,
    // vertexShader: vertexShader(),
  });
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<SC.Canvas>
  <SC.Mesh geometry={new THREE.PlaneGeometry(2, 2)} {material} />
  <SC.OrthographicCamera />
</SC.Canvas>

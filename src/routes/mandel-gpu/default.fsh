uniform vec2 size;

void main() {
  vec2 pos = gl_FragCoord.xy / size.xy;
  gl_FragColor = vec4(pos.x, pos.y, 1.0, 1.0);
}

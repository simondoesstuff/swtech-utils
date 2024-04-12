uniform vec2 size;
uniform float t;
uniform float zoom;
uniform vec2 mouse;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 mandelIterSingle(vec2 z, vec2 c) {
  return vec2(z[0]*z[0] - z[1]*z[1] + c[0],
    2.0 * z[1] * z[0] + c[1]
  );
}

vec2 mandel(vec2 z, vec2 c) {
  int iMax = 1000;
  float zMax = 2.1;

  for (int i = 0; i < iMax; i++) {
    z = mandelIterSingle(z, c);

    float zMag = sqrt(z[0] * z[0] + z[1] * z[1]);
    if (zMag >= zMax) {
      z = mandelIterSingle(z, c); // helps decrease error
      z = mandelIterSingle(z, c);
      float renor = float(i) + 1.0 - log(log( zMag )) / 0.301;
      return vec2(renor / 500.0, 1.0);
    }
  }

  // return vec2(0,0);
  float delta = pow((z[0] - c[0]), 2.0) + pow((z[1] - c[1]), 2.0);
  return vec2(delta / zMax * 100.0, 0.02);
}

void main() {
    float scale = 2.7;
    vec2 offset = vec2(2, 1.5);

    vec2 center = mouse / size.xy * scale;
    vec2 pos = gl_FragCoord.xy / size.xy * scale;
    pos = (pos - center - offset) / zoom + center;

    vec2 c = pos;
    // vec2 z0 = 0.6 * vec2(cos(t), sin(t));
    vec2 z0 = vec2(0.0, 0.0);

    vec2 result = mandel(z0, c + 0.3 * z0);
    float hue = result.x;
    float alt = result.y;
    vec3 hsv = vec3(hue, 2.0 * alt, 10.0 * hue * alt);
    vec3 rgb = hsv2rgb(hsv);
    gl_FragColor = vec4(rgb, 1.0);
}

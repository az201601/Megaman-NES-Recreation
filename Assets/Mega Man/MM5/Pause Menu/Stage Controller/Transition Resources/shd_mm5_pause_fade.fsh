precision highp float;
varying vec2 v_vTexcoord;
varying vec4 v_vColour;
uniform sampler2D s_fade_lut;
uniform float u_dim;
uniform float u_white30;
void main()
{
    vec4 src = v_vColour * texture2D(gm_BaseTexture, v_vTexcoord);
    vec3 q = floor(clamp(src.rgb, 0.0, 1.0) * 15.0 + 0.5);
    float key = q.r + 16.0 * q.g + 256.0 * q.b;
    float slice = u_dim - 1.0 + 4.0 * u_white30;
    vec2 uv = vec2((mod(key, 64.0) + 0.5) / 64.0,
                   (floor(key / 64.0) + slice * 64.0 + 0.5) / 512.0);
    gl_FragColor = vec4(texture2D(s_fade_lut, uv).rgb, src.a);
}

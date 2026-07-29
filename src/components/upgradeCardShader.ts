import {Skia} from '@shopify/react-native-skia';

const source = `
uniform float2 u_size;
uniform float  u_time;
uniform float4 u_c0;
uniform float4 u_c1;
uniform float4 u_c2;
uniform float4 u_c3;

half4 main(float2 xy) {
  float2 uv = xy / u_size;
  float t = u_time;

  float2 p0 = float2(0.18 + 0.16 * sin(t * 0.52), 0.22 + 0.12 * cos(t * 0.41));
  float2 p1 = float2(0.86 + 0.11 * cos(t * 0.46), 0.18 + 0.13 * sin(t * 0.55));
  float2 p2 = float2(0.24 + 0.13 * cos(t * 0.35), 0.84 + 0.11 * sin(t * 0.48));
  float2 p3 = float2(0.82 + 0.14 * sin(t * 0.39), 0.88 + 0.12 * cos(t * 0.44));

  float w0 = 1.0 / (dot(uv - p0, uv - p0) + 0.025);
  float w1 = 1.0 / (dot(uv - p1, uv - p1) + 0.025);
  float w2 = 1.0 / (dot(uv - p2, uv - p2) + 0.025);
  float w3 = 1.0 / (dot(uv - p3, uv - p3) + 0.025);
  float sum = w0 + w1 + w2 + w3;

  float4 col = (u_c0 * w0 + u_c1 * w1 + u_c2 * w2 + u_c3 * w3) / sum;
  col.rgb += 0.04 * sin((uv.x + uv.y) * 6.2831 + t * 0.9);

  float vig = smoothstep(0.85, 0.30, length(uv - 0.5));
  col.rgb *= mix(0.62, 1.0, vig);

  return half4(col);
}
`;

const effect = Skia.RuntimeEffect.Make(source);
if (!effect) throw new Error('upgradeCardShader: el RuntimeEffect de Skia no compiló');

export const upgradeCardShader = effect;

export const UPGRADE_PALETTE = ['#0f766e', '#1e40af', '#6d28d9', '#b45309'] as const;

export const hex01 = (hex: string) => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
    1,
  ];
};

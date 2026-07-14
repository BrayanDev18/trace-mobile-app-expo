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

  float2 p0 = float2(0.20 + 0.14 * sin(t * 0.50), 0.24 + 0.10 * cos(t * 0.43));
  float2 p1 = float2(0.84 + 0.10 * cos(t * 0.47), 0.20 + 0.12 * sin(t * 0.51));
  float2 p2 = float2(0.26 + 0.12 * cos(t * 0.37), 0.82 + 0.10 * sin(t * 0.49));
  float2 p3 = float2(0.80 + 0.13 * sin(t * 0.41), 0.86 + 0.11 * cos(t * 0.45));

  float w0 = 1.0 / (dot(uv - p0, uv - p0) + 0.03);
  float w1 = 1.0 / (dot(uv - p1, uv - p1) + 0.03);
  float w2 = 1.0 / (dot(uv - p2, uv - p2) + 0.03);
  float w3 = 1.0 / (dot(uv - p3, uv - p3) + 0.03);
  float sum = w0 + w1 + w2 + w3;

  float4 col = (u_c0 * w0 + u_c1 * w1 + u_c2 * w2 + u_c3 * w3) / sum;
  col.rgb += 0.05 * sin((uv.x + uv.y) * 6.2831 + t * 0.8);

  float vig = smoothstep(0.80, 0.30, length(uv - 0.5));
  col.rgb *= mix(0.5, 1.0, vig);

  return half4(col);
}
`;

const effect = Skia.RuntimeEffect.Make(source);
if (!effect) throw new Error('balanceShader: el RuntimeEffect de Skia no compiló');

export const balanceShader = effect;

export const BALANCE_PALETTES = {
  esmeralda: ['#022f2e', '#00d5be', '#041e13', '#022f2e'],
  aurora: ['#0f6b43', '#149e8e', '#208aef', '#7bd0a8'],
  atardecer: ['#0f6b43', '#3aa06a', '#f4c24e', '#e6d5a8'],
} as const;

export type PaletteNameProps = keyof typeof BALANCE_PALETTES;

export const hex01 = (hex: string) => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
    1,
  ];
};

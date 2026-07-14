import {useMemo} from "react";
import {StyleProp, StyleSheet, View, ViewStyle, useColorScheme} from "react-native";
import {Canvas, Fill, Shader, Skia} from "@shopify/react-native-skia";

const shader = Skia.RuntimeEffect.Make(`
uniform float  u_gap;
uniform float  u_radius;
uniform float  u_opacity;
uniform float4 u_color;

float hash(float2 p) {
  return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

half4 main(float2 xy) {
  float row = floor(xy.y / u_gap + 0.5);
  float xo = mod(row, 2.0) * u_gap * 0.5;
  float col = floor((xy.x - xo) / u_gap + 0.5);
  float2 center = float2(col * u_gap + xo, row * u_gap);
  float d = distance(xy, center);

  float alpha = 0.25 + 0.55 * hash(float2(col, row));
  float body = (1.0 - smoothstep(u_radius - 0.75, u_radius + 0.75, d)) * alpha * u_color.a;
  float a = body * u_opacity;

  return half4(half3(u_color.rgb) * a, half(a));
}
`)!;

type DottedGlowBackgroundProps = {
  style?: StyleProp<ViewStyle>;
  gap?: number;
  radius?: number;
  color?: string;
  darkColor?: string;
  opacity?: number;
};

export const DottedGlowBackground = (props: DottedGlowBackgroundProps) => {
  const {
    style,
    gap = 12,
    radius = 2,
    color = "rgba(0,0,0,0.7)",
    darkColor,
    opacity = 0.1,
  } = props;

  const isDark = useColorScheme() === "dark";
  const dotColor = isDark ? darkColor ?? color : color;

  const uniforms = useMemo(
    () => ({
      u_gap: gap,
      u_radius: radius,
      u_opacity: opacity,
      u_color: Array.from(Skia.Color(dotColor)),
    }),
    [gap, radius, opacity, dotColor],
  );

  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill}>
        <Fill>
          <Shader source={shader} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
};

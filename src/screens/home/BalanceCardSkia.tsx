import {useMemo, useRef, useState} from 'react';
import {LayoutChangeEvent, Modal, Pressable, StyleSheet, useColorScheme, View} from 'react-native';
import {Canvas, Fill, Shader, Skia} from '@shopify/react-native-skia';
import {useDerivedValue, useReducedMotion} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconDots,
  type Icon,
} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {useAnimationClock} from '@/hooks/useAnimationClock';
import {formatCurrency} from '@/utils';

const shader = Skia.RuntimeEffect.Make(`
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

  // peso por distancia inversa: cada punto tiñe su zona y sangra hacia los demás
  float w0 = 1.0 / (dot(uv - p0, uv - p0) + 0.03);
  float w1 = 1.0 / (dot(uv - p1, uv - p1) + 0.03);
  float w2 = 1.0 / (dot(uv - p2, uv - p2) + 0.03);
  float w3 = 1.0 / (dot(uv - p3, uv - p3) + 0.03);
  float sum = w0 + w1 + w2 + w3;

  float4 col = (u_c0 * w0 + u_c1 * w1 + u_c2 * w2 + u_c3 * w3) / sum;
  col.rgb += 0.05 * sin((uv.x + uv.y) * 6.2831 + t * 0.8);

  // bordes más oscuros: viñeta que atenúa hacia las orillas
  float vig = smoothstep(0.80, 0.30, length(uv - 0.5));
  col.rgb *= mix(0.5, 1.0, vig);

  return half4(col);
}
`)!;

export const BALANCE_PALETTES = {
  esmeralda: ['#0e5a3a', '#3fae7a', '#041e13', '#0c5033'],
  aurora: ['#0f6b43', '#149e8e', '#208aef', '#7bd0a8'],
  atardecer: ['#0f6b43', '#3aa06a', '#f4c24e', '#e6d5a8'],
} as const;

export type PaletteName = keyof typeof BALANCE_PALETTES;

const hex01 = (hex: string) => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
    1,
  ];
};

export const balanceSize = (value: number) => {
  const digits = Math.floor(Math.abs(value)).toString().length;
  if (digits <= 6) return 'text-5xl';
  if (digits <= 9) return 'text-4xl';
  return 'text-3xl';
};

export type Overview = {label: string; value: number};

type BalanceCardSkiaProps = {
  overviews?: Overview[];
  income?: number;
  expense?: number;
  palette?: PaletteName;
};

type OverviewPopoverProps = {
  visible: boolean;
  anchor: {x: number; y: number; width: number; height: number};
  overviews: Overview[];
  selected: number;
  onSelect: (index: number) => void;
  onClose: () => void;
};

export const OverviewPopover = ({
  visible,
  anchor,
  overviews,
  selected,
  onSelect,
  onClose,
}: OverviewPopoverProps) => {
  const scheme = useColorScheme();
  const check = scheme === 'dark' ? '#34d399' : '#059669';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          className="absolute rounded-2xl border border-neutral-200 bg-secundary p-1.5 dark:border-neutral-800"
          style={{
            top: anchor.y + anchor.height + 8,
            left: anchor.x,
            minWidth: 220,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: {width: 0, height: 1},
          }}
        >
          {overviews.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => onSelect(index)}
              className="flex-row items-center justify-between gap-6 rounded-xl px-3 py-2.5 active:bg-neutral-200 dark:active:bg-white/5"
            >
              <View>
                <Text className="font-satoshi-medium text-primary">
                  {item.label}
                </Text>
                <Text
                  className="font-satoshi text-xs text-secundary"
                  numberOfLines={1}
                  style={{fontVariant: ['tabular-nums']}}
                >
                  $ {formatCurrency(item.value)}
                </Text>
              </View>
              {index === selected && <IconCheck size={18} color={check} />}
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

type StatProps = {icon: Icon; label: string; value: number};

export const Stat = ({icon: Icon, label, value}: StatProps) => (
  <View
    className="flex-1 flex-row items-center gap-2 overflow-hidden rounded-2xl bg-white/20 px-2.5 py-1.5"
  >
    <View className="h-7 w-7 items-center justify-center rounded-full bg-white/25">
      <Icon size={16} color="#ffffff" />
    </View>

    <View>
      <Text className="text-white">{label}</Text>
      <Text
        className="font-satoshi-bold text-sm text-white"
        numberOfLines={1}
        style={{fontVariant: ['tabular-nums']}}
      >
        $ {formatCurrency(value)}
      </Text>
    </View>
  </View>
);

export const BalanceCardSkia = ({
  overviews = [{label: 'Daily overview', value: 0}],
  income = 0,
  expense = 0,
  palette = 'esmeralda',
}: BalanceCardSkiaProps) => {
  const [size, setSize] = useState({width: 0, height: 0});
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({x: 0, y: 0, width: 0, height: 0});
  const triggerRef = useRef<View>(null);
  const reduced = useReducedMotion();
  const clock = useAnimationClock(30, !reduced);

  const current = overviews[selected] ?? overviews[0];

  const openPopover = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({x, y, width, height});
      setOpen(true);
    });
  };

  const selectPeriod = (index: number) => {
    if (process.env.EXPO_OS === 'ios') void Haptics.selectionAsync();
    setSelected(index);
    setOpen(false);
  };

  const colors = useMemo(() => BALANCE_PALETTES[palette].map(hex01), [palette]);

  const uniforms = useDerivedValue(
    () => ({
      u_size: [size.width, size.height],
      u_time: reduced ? 4 : clock.value / 1000,
      u_c0: colors[0],
      u_c1: colors[1],
      u_c2: colors[2],
      u_c3: colors[3],
    }),
    [clock, size, colors, reduced],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : {width, height}));
  };

  return (
    <>
    <View
      onLayout={onLayout}
      style={{borderRadius: 24, overflow: 'hidden'}}
    >
      {size.width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <Fill>
            <Shader source={shader} uniforms={uniforms} />
          </Fill>
        </Canvas>
      )}

      <View className="gap-5 p-5">
        <View className="flex-row items-center justify-between">
          <Pressable
            ref={triggerRef}
            onPress={openPopover}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Cambiar periodo"
            className="flex-row items-center gap-1 px-2 py-0.5 justify-center bg-white/20 rounded-full"
          >
            <Text className="text-white">{current.label}</Text>
            {open ? (
              <IconChevronUp size={16} color="rgba(255,255,255,0.9)" />
            ) : (
              <IconChevronDown size={16} color="rgba(255,255,255,0.9)" />
            )}
          </Pressable>

          <IconDots size={20} color="rgba(255,255,255,0.9)" />
        </View>

        <Text
          selectable
          numberOfLines={1}
          className={`font-satoshi-medium tracking-tight text-white ${balanceSize(current.value)}`}
          style={{fontVariant: ['tabular-nums']}}
        >
          $ {formatCurrency(current.value)}
        </Text>

        <View className="flex-row gap-3">
          <Stat icon={IconArrowDownLeft} label="Ingresos" value={income} />
          <Stat icon={IconArrowUpRight} label="Gastos" value={expense} />
        </View>
      </View>
    </View>

      <OverviewPopover
        visible={open}
        anchor={anchor}
        overviews={overviews}
        selected={selected}
        onSelect={selectPeriod}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

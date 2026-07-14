import {useMemo, useRef, useState} from 'react';
import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
import {Canvas, Fill, Shader} from '@shopify/react-native-skia';
import {useDerivedValue, useReducedMotion} from 'react-native-reanimated';
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconChevronDown,
  IconChevronUp,
  IconDots,
  type Icon,
} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {useAnimationClock} from '@/hooks/useAnimationClock';
import {amountSizeClass, formatCurrency, haptic} from '@/utils';

import {BALANCE_PALETTES, balanceShader, hex01, type PaletteName} from './balanceShader';
import {OverviewPopover, type Overview} from './OverviewPopover';

type BalanceCardSkiaProps = {
  overviews?: Overview[];
  income?: number;
  expense?: number;
  palette?: PaletteName;
};

export const BalanceCardSkia = (props: BalanceCardSkiaProps) => {
  const {
    overviews = [{label: 'Hoy', value: 0}],
    income = 0,
    expense = 0,
    palette = 'esmeralda',
  } = props;

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
    haptic.select();
    setSelected(index);
    setOpen(false);
  };

  const colors = useMemo(() => BALANCE_PALETTES[palette].map(hex01), [palette]);

  const uniforms = useDerivedValue(
    () => ({
      u_size: [size.width, size.height],
      u_time: reduced ? 4 : (clock.value / 1000) * 2,
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
      <View onLayout={onLayout} style={{borderRadius: 24, overflow: 'hidden'}}>
        {size.width > 0 && (
          <Canvas style={StyleSheet.absoluteFill}>
            <Fill>
              <Shader source={balanceShader} uniforms={uniforms} />
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
              className="flex-row items-center gap-1 px-2.5 py-0.5 justify-center bg-teal-700/50 rounded-full"
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
            className={`font-satoshi-medium text-white ${amountSizeClass(current.value, 'card')}`}
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

type StatProps = {icon: Icon; label: string; value: number};

const Stat = ({icon: Icon, label, value}: StatProps) => (
  <View className="flex-1 flex-row items-center gap-2 overflow-hidden rounded-2xl bg-teal-700/50 px-2.5 py-1.5">
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

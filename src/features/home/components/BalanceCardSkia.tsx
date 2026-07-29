import {useMemo, useRef, useState} from 'react';
import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
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

import {BALANCE_PALETTES, balanceShader, hex01, type PaletteNameProps} from './balanceShader';
import {OverviewPopover} from './OverviewPopover';
import type {OverviewProps, PeriodProps} from '../utils';

type BalanceCardSkiaProps = {
  overviews: OverviewProps[];
  current: OverviewProps;
  onSelectPeriod: (period: PeriodProps) => void;
  palette?: PaletteNameProps;
};

export const BalanceCardSkia = (props: BalanceCardSkiaProps) => {
  const {overviews, current, onSelectPeriod, palette = 'esmeralda'} = props;

  const {t} = useTranslation();
  const [size, setSize] = useState({width: 0, height: 0});
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({x: 0, y: 0, width: 0, height: 0});
  const triggerRef = useRef<View>(null);
  const reduced = useReducedMotion();
  const clock = useAnimationClock(30, !reduced);

  const openPopover = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({x, y, width, height});
      setOpen(true);
    });
  };

  const selectPeriod = (period: PeriodProps) => {
    haptic.select();
    onSelectPeriod(period);
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
              accessibilityLabel={t('home:overview.changePeriod')}
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

          <View className="gap-1">
            <Text
              selectable
              numberOfLines={1}
              className={`font-satoshi-medium text-white ${amountSizeClass(current.balance, 'card')}`}
              style={{fontVariant: ['tabular-nums']}}
            >
              {current.balance < 0 ? '-' : ''}$ {formatCurrency(Math.abs(current.balance))}
            </Text>

            <Text className="text-white/80">{current.caption}</Text>
          </View>

          <View className="flex-row gap-3">
            <Stat
              icon={IconArrowDownLeft}
              label={t('home:overview.income')}
              value={current.income}
            />
            <Stat
              icon={IconArrowUpRight}
              label={t('home:overview.expense')}
              value={current.expense}
            />
          </View>
        </View>
      </View>

      <OverviewPopover
        visible={open}
        anchor={anchor}
        overviews={overviews}
        selected={current.period}
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

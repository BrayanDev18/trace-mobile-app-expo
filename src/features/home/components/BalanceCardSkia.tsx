import {useMemo, useState} from 'react';
import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {Canvas, Fill, Shader} from '@shopify/react-native-skia';
import {useDerivedValue, useReducedMotion} from 'react-native-reanimated';

import {Text} from '@/components';
import {ScreenRoutes} from '@/constants';
import {useAnimationClock} from '@/hooks/useAnimationClock';
import {amountSizeClass, formatCurrency, shortDate} from '@/utils';

import {BALANCE_PALETTES, balanceShader, hex01, type PaletteNameProps} from './balanceShader';
import type {HomeBalanceProps} from '../hooks/useHomeBalance';

const DAY_MS = 86_400_000;

type BalanceCardSkiaProps = {
  overview: HomeBalanceProps;
  palette?: PaletteNameProps;
};

export const BalanceCardSkia = ({overview, palette = 'esmeralda'}: BalanceCardSkiaProps) => {
  const {t} = useTranslation();
  const [size, setSize] = useState({width: 0, height: 0});
  const reduced = useReducedMotion();
  const clock = useAnimationClock(30, !reduced);

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

  const {state, amount, ratio, cycle, daysLeft} = overview;

  const rangeLabel = cycle
    ? `${shortDate(cycle.start)} – ${shortDate(new Date(cycle.end.getTime() - DAY_MS))}`
    : t('home:overview.allTime');

  const caption =
    state === 'ready'
      ? t('income:cycle.available')
      : state === 'amountless'
        ? t('income:cycle.spent')
        : t('home:overview.balance');

  const stats =
    state === 'unset'
      ? [
          {label: t('home:overview.income'), value: overview.income},
          {label: t('home:overview.expense'), value: overview.spent},
        ]
      : [
          ...(state === 'ready'
            ? [{label: t('income:cycle.income'), value: overview.income}]
            : []),
          {label: t('income:cycle.committed'), value: overview.committed},
          {label: t('income:cycle.spent'), value: overview.spent},
        ];

  return (
    <View onLayout={onLayout} style={{borderRadius: 24, overflow: 'hidden'}}>
      {size.width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <Fill>
            <Shader source={balanceShader} uniforms={uniforms} />
          </Fill>
        </Canvas>
      )}

      <View className="gap-5 p-5">
        <View className="flex-row items-center justify-between gap-3">
          <View className="rounded-full bg-teal-700/50 px-2.5 py-0.5">
            <Text className="text-white">{rangeLabel}</Text>
          </View>

          {cycle && (
            <Text className="text-sm text-white/80">
              {t('income:cycle.daysLeft', {count: daysLeft})}
            </Text>
          )}
        </View>

        <View className="gap-1">
          <Text
            selectable
            numberOfLines={1}
            className={`font-satoshi-medium text-white ${amountSizeClass(amount, 'card')}`}
            style={{fontVariant: ['tabular-nums']}}
          >
            {amount < 0 ? '-' : ''}$ {formatCurrency(Math.abs(amount))}
          </Text>

          <Text className="text-white/80">{caption}</Text>
        </View>

        {ratio !== null && (
          <View className="h-1.5 overflow-hidden rounded-full bg-white/25">
            <View className="h-full rounded-full bg-white" style={{width: `${ratio * 100}%`}} />
          </View>
        )}

        <View className="flex-row gap-3">
          {stats.map((stat) => (
            <Stat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </View>

        {state !== 'ready' && (
          <Pressable
            onPress={() => router.push(ScreenRoutes.incomeSetup)}
            hitSlop={8}
            accessibilityRole="button"
            className="active:opacity-70"
          >
            <Text className="text-sm text-white/80">
              {state === 'unset' ? t('home:overview.setupCycle') : t('income:cycle.setAmount')}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const Stat = ({label, value}: {label: string; value: number}) => (
  <View className="flex-1 gap-0.5 overflow-hidden rounded-2xl bg-teal-700/50 px-2.5 py-1.5">
    <Text numberOfLines={1} className="text-sm text-white/80">
      {label}
    </Text>

    <Text
      numberOfLines={1}
      className="font-satoshi-bold text-sm text-white"
      style={{fontVariant: ['tabular-nums']}}
    >
      ${formatCurrency(value)}
    </Text>
  </View>
);

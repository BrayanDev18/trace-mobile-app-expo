import {useMemo, useState} from 'react';
import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
import {Canvas, Fill, Shader} from '@shopify/react-native-skia';
import {useDerivedValue, useReducedMotion} from 'react-native-reanimated';
import {IconCrownFilled} from '@tabler/icons-react-native';

import {Text} from '@/components/Text';
import {useAnimationClock} from '@/hooks/useAnimationClock';
import {haptic} from '@/utils';

import {UPGRADE_PALETTE, hex01, upgradeCardShader} from './upgradeCardShader';

type UpgradeCardProps = {
  title: string;
  description: string;
  badge: string;
  action?: string;
  status?: string;
  active?: boolean;
  onPress?: () => void;
};

export const UpgradeCard = (props: UpgradeCardProps) => {
  const {title, description, badge, action, status, active = false, onPress} = props;
  const [size, setSize] = useState({width: 0, height: 0});
  const reduced = useReducedMotion();
  const clock = useAnimationClock(30, !reduced);

  const colors = useMemo(() => UPGRADE_PALETTE.map(hex01), []);

  const uniforms = useDerivedValue(
    () => ({
      u_size: [size.width, size.height],
      u_time: reduced ? 3 : (clock.value / 1000) * 2,
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

  const press = () => {
    haptic.select();
    onPress?.();
  };

  return (
    <View onLayout={onLayout} style={{borderRadius: 24, overflow: 'hidden'}}>
      {size.width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <Fill>
            <Shader source={upgradeCardShader} uniforms={uniforms} />
          </Fill>
        </Canvas>
      )}

      <View className="gap-4 p-5">
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="font-satoshi-bold text-2xl tracking-tight text-white">{title}</Text>

            <View className="rounded-full bg-white/20 px-2 py-0.5">
              <Text className="font-satoshi-bold text-xs text-white">{badge}</Text>
            </View>
          </View>

          <Text className="text-white/80">{description}</Text>
        </View>

        {active ? (
          <View className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-white/15">
            <IconCrownFilled size={18} color="#ffffff" />
            <Text className="font-satoshi-bold text-white">{status}</Text>
          </View>
        ) : (
          <Pressable
            onPress={press}
            className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-neutral-950 active:opacity-80"
          >
            <IconCrownFilled size={18} color="#ffffff" />
            <Text className="font-satoshi-bold text-white">{action}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

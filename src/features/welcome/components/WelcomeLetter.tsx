import {ReactNode, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Image} from 'expo-image';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import {IconArrowRight} from '@tabler/icons-react-native';

import {Button, Text} from '@/components';
import {useColorScheme} from '@/hooks/useColorScheme';
import {BlurView} from "expo-blur";

const SHAPE_BURST = require('@assets/shapes/8.png');
const SHAPE_BLOB = require('@assets/shapes/2.png');
const SHAPE_FLOWER = require('@assets/shapes/3.png');
const SHAPE_RING = require('@assets/shapes/4.png');
const SHAPE_CREST = require('@assets/shapes/5.png');
const SHAPE_SPIRAL = require('@assets/shapes/6.png');
const SHAPE_PETALS = require('@assets/shapes/7.png');
const SHAPE_HEARTH = require('@assets/shapes/9.png');

type BackdropShapeProps = {
  source: number;
  size: number;
  className: string;
};

const BACKDROP_SHAPES: BackdropShapeProps[] = [
  {source: SHAPE_RING, size: 152, className: '-left-14 top-0 -rotate-12 opacity-35'},
  {source: SHAPE_CREST, size: 100, className: '-right-8 top-12 rotate-[18deg] opacity-40'},
  {source: SHAPE_BLOB, size: 112, className: '-left-12 top-[42%] -rotate-6 opacity-40'},
  {source: SHAPE_FLOWER, size: 140, className: '-right-16 top-[47%] rotate-12 opacity-35'},
  {source: SHAPE_PETALS, size: 96, className: '-left-10 bottom-10 rotate-[22deg] opacity-40'},
  {source: SHAPE_SPIRAL, size: 124, className: '-right-12 bottom-0 -rotate-[14deg] opacity-40'},
];

type WelcomeLetterProps = {
  name?: string;
  onEnter: () => void;
};

export const WelcomeLetter = ({name, onEnter}: WelcomeLetterProps) => {
  const {t} = useTranslation();
  const dark = useColorScheme() === 'dark';
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = reduced
      ? withTiming(1, {duration: 150})
      : withTiming(1, {duration: 1900, easing: Easing.out(Easing.cubic)});
  }, [progress, reduced]);

  return (
    <View className="items-center gap-8 h-full justify-center">
      <Backdrop progress={progress}/>

      <BlurView
        tint={dark ? 'dark' : 'light'}
        intensity={50}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          padding: 30,
          borderRadius: 20,
          overflow: 'hidden'
        }}
      >
        <Reveal progress={progress} index={0} still={reduced}>
          <Image source={SHAPE_BURST} contentFit="contain" style={{width: 80, height: 80}}/>
        </Reveal>

        <View className="gap-5">
          <Reveal progress={progress} index={1} still={reduced}>
            <View className="flex-row gap-3 items-center justify-center">
              <Text className="text-center font-satoshi-bold text-4xl leading-tight tracking-tight">
                {name ? t('welcome:unlocked.titleNamed', {name}) : t('welcome:unlocked.title')}
              </Text>

              <Image source={SHAPE_HEARTH} contentFit="contain" style={{width: 40, height: 40}}/>
            </View>
          </Reveal>

          <Reveal progress={progress} index={2} still={reduced}>
            <Text className="text-center text-xl text-neutral-700 dark:text-neutral-300">{t('welcome:unlocked.welcome')}</Text>
          </Reveal>

          <Reveal progress={progress} index={3} still={reduced}>
            <Text className="text-center text-xl text-neutral-700 dark:text-neutral-300">{t('welcome:unlocked.body')}</Text>
          </Reveal>

          <Reveal progress={progress} index={4} still={reduced}>
            <Text className="text-center text-xl text-neutral-700 dark:text-neutral-300">
              {t('welcome:unlocked.badge')}
            </Text>
          </Reveal>
        </View>

        <Reveal progress={progress} index={5} still={reduced}>
          <Button
            label={t('welcome:unlocked.action')}
            icon={IconArrowRight}
            onPress={onEnter}
            className="w-48 active:bg-accent-pressed mt-10"
          />
        </Reveal>
      </BlurView>
    </View>
  );
};

type BackdropProps = {
  progress: SharedValue<number>;
};

const Backdrop = ({progress}: BackdropProps) => {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.65], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      {BACKDROP_SHAPES.map(({source, size, className}) => (
        <View key={className} className={`absolute ${className}`}>
          <Image source={source} contentFit="contain" style={{width: size, height: size}}/>
        </View>
      ))}
    </Animated.View>
  );
};

type RevealProps = {
  progress: SharedValue<number>;
  index: number;
  still: boolean;
  children: ReactNode;
};

const Reveal = (props: RevealProps) => {
  const {progress, index, still, children} = props;
  const start = index * 0.11;

  const style = useAnimatedStyle(() => {
    const step = interpolate(progress.value, [start, start + 0.45], [0, 1], Extrapolation.CLAMP);
    return {opacity: step, transform: [{translateY: still ? 0 : (1 - step) * 14}]};
  });

  return <Animated.View style={style}>{children}</Animated.View>;
};

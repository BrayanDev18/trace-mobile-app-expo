import {ReactNode} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {Text} from '@/components/Text';
import {cn} from '@/utils';

const PANEL_HEIGHT = 330;

type CapturePanelProps = {
  chips: ReactNode;
  panel: string;
  panels: Record<string, ReactNode>;
  submitLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
};

export const CapturePanel = (props: CapturePanelProps) => {
  const {chips, panel, panels, submitLabel, onSubmit, disabled} = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      className="gap-3 rounded-t-[28px] bg-secundary px-4 pt-7"
      style={{
        paddingBottom: insets.bottom + 10,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.04)',
      }}
    >
      <View className="flex-row flex-wrap justify-center gap-3">{chips}</View>

      <View style={{height: PANEL_HEIGHT}}>
        {Object.entries(panels).map(([name, content]) =>
          panel === name ? (
            <Animated.View
              key={name}
              entering={FadeIn.duration(150)}
              exiting={FadeOut.duration(120)}
              style={StyleSheet.absoluteFill}
              className="justify-center"
            >
              {content}
            </Animated.View>
          ) : null,
        )}
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={disabled}
        className={cn(
          'h-14 items-center justify-center rounded-full btn-primary active:bg-accent-pressed',
          disabled && 'opacity-40',
        )}
      >
        <Text className="font-satoshi-bold text-white">{submitLabel}</Text>
      </Pressable>
    </View>
  );
};
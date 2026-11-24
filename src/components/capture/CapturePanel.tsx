import {ReactNode} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {KeyboardStickyView, useKeyboardState} from 'react-native-keyboard-controller';

import {Text} from '@/components/Text';
import {cn} from '@/utils';

const PANEL_HEIGHT = 330;

type CapturePanelProps = {
  chips?: ReactNode;
  panel: string;
  panels: Record<string, ReactNode>;
  submitLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
  panelHeight?: number;
};

export const CapturePanel = (props: CapturePanelProps) => {
  const {chips, panel, panels, submitLabel, onSubmit, disabled, panelHeight} = props;
  const insets = useSafeAreaInsets();
  const keyboardOpen = useKeyboardState((state) => state.isVisible);

  return (
    <View
      className="gap-3 rounded-t-[28px] bg-secundary px-4 pt-7"
      style={{
        paddingBottom: insets.bottom + 10,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.04)',
      }}
    >
      {chips && <View className="flex-row flex-wrap justify-center gap-3">{chips}</View>}

      <View style={{height: panelHeight || PANEL_HEIGHT}}>
        {Object.entries(panels).map(([name, content]) =>
          panel === name && !keyboardOpen ? (
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

      <KeyboardStickyView offset={{opened: insets.bottom + 10}}>
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
      </KeyboardStickyView>
    </View>
  );
};
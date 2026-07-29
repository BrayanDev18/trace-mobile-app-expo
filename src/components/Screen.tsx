import {ReactNode, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  type KeyboardAvoidingViewProps,
  type LayoutChangeEvent,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from 'react-native-keyboard-controller';
import {useScrollToTop} from 'expo-router';
import {StatusBar, type StatusBarProps, type StatusBarStyle} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';

import {RowBack} from '@/components/RowBack';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useSafeAreaInsetsStyle, type ExtendedEdge} from '@/utils';

const DEFAULT_BOTTOM_OFFSET = 50;

type BaseScreenProps = {
  children?: ReactNode;
  withGlow?: boolean;
  canGoBack?: boolean;
  keyboard?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: ExtendedEdge[];
  backgroundColor?: string;
  systemBarStyle?: StatusBarStyle;
  keyboardOffset?: number;
  keyboardBottomOffset?: number;
  SystemBarsProps?: StatusBarProps;
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
};

type FixedScreenProps = BaseScreenProps & {
  preset?: 'fixed';
};

type ScrollScreenProps = BaseScreenProps & {
  preset?: 'scroll';
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  ScrollViewProps?: ScrollViewProps;
};

type AutoScreenProps = Omit<ScrollScreenProps, 'preset'> & {
  preset?: 'auto';
  scrollEnabledToggleThreshold?: {percent?: number; point?: number};
};

export type ScreenProps = ScrollScreenProps | FixedScreenProps | AutoScreenProps;

type ScreenPresetProps = 'fixed' | 'scroll' | 'auto';

const isIos = Platform.OS === 'ios';

const isNonScrolling = (preset?: ScreenPresetProps) => !preset || preset === 'fixed';

const useAutoPreset = (props: AutoScreenProps) => {
  const {preset, scrollEnabledToggleThreshold} = props;
  const {percent = 0.92, point = 0} = scrollEnabledToggleThreshold || {};

  const scrollViewHeight = useRef<null | number>(null);
  const scrollViewContentHeight = useRef<null | number>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const updateScrollState = () => {
    if (scrollViewHeight.current === null || scrollViewContentHeight.current === null) return;

    const contentFitsScreen = point
      ? scrollViewContentHeight.current < scrollViewHeight.current - point
      : scrollViewContentHeight.current < scrollViewHeight.current * percent;

    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false);
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true);
  };

  const onContentSizeChange = (w: number, h: number) => {
    scrollViewContentHeight.current = h;
    updateScrollState();
  };

  const onLayout = (e: LayoutChangeEvent) => {
    scrollViewHeight.current = e.nativeEvent.layout.height;
    updateScrollState();
  };

  useEffect(() => {
    if (preset === 'auto') updateScrollState();
  });

  return {
    scrollEnabled: preset === 'auto' ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  };
};

const ScreenWithoutScrolling = (props: ScreenProps) => {
  const {style, contentContainerStyle, children} = props;

  return (
    <View style={[outerStyle, style]}>
      <View style={[fixedInnerStyle, contentContainerStyle]}>{children}</View>
    </View>
  );
};

const ScreenWithScrolling = (props: ScreenProps) => {
  const {
    children,
    keyboardShouldPersistTaps = 'handled',
    keyboardBottomOffset = DEFAULT_BOTTOM_OFFSET,
    contentContainerStyle,
    ScrollViewProps,
    style,
  } = props as ScrollScreenProps;

  const ref = useRef<KeyboardAwareScrollViewRef>(null);
  const {scrollEnabled, onContentSizeChange, onLayout} = useAutoPreset(props as AutoScreenProps);

  useScrollToTop(ref);

  return (
    <KeyboardAwareScrollView
      bottomOffset={keyboardBottomOffset}
      {...{keyboardShouldPersistTaps, scrollEnabled, ref}}
      showsVerticalScrollIndicator={false}
      {...ScrollViewProps}
      onLayout={(e) => {
        onLayout(e);
        ScrollViewProps?.onLayout?.(e);
      }}
      onContentSizeChange={(w: number, h: number) => {
        onContentSizeChange(w, h);
        ScrollViewProps?.onContentSizeChange?.(w, h);
      }}
      style={[outerStyle, ScrollViewProps?.style, style]}
      contentContainerStyle={[
        scrollInnerStyle,
        ScrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export const Screen = (props: ScreenProps) => {
  const {
    backgroundColor,
    KeyboardAvoidingViewProps,
    keyboard = false,
    keyboardOffset = 0,
    safeAreaEdges = ['top', 'bottom'],
    SystemBarsProps,
    systemBarStyle,
    withGlow = true,
    canGoBack = true,
  } = props;

  const theme = useColorScheme();
  const containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  const glow: [string, string] =
    theme === 'dark' ? ['#022f2e', 'rgba(10,10,10,0)'] : ['#cbfbf1', 'rgba(245,245,245,0)'];

  return (
    <View
      className="bg-primary"
      style={[containerStyle, backgroundColor ? {backgroundColor} : undefined, containerInsets]}
    >
      <StatusBar
        style={systemBarStyle ?? (theme === 'dark' ? 'light' : 'dark')}
        {...SystemBarsProps}
      />

      {withGlow && (
        <LinearGradient
          colors={glow}
          style={{position: 'absolute', top: 0, left: 0, right: 0, height: 150}}
        />
      )}

      <KeyboardAvoidingView
        enabled={keyboard && isNonScrolling(props.preset)}
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
        {...KeyboardAvoidingViewProps}
        style={[{flex: 1}, KeyboardAvoidingViewProps?.style]}
      >
        {isNonScrolling(props.preset) ? (
          <ScreenWithoutScrolling {...props} />
        ) : (
          <ScreenWithScrolling {...props} />
        )}
      </KeyboardAvoidingView>

      {canGoBack && <RowBack />}
    </View>
  );
};

const containerStyle: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%',
};

const outerStyle: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%',
};

const fixedInnerStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};

const scrollInnerStyle: ViewStyle = {
  flexGrow: 1,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};

import {ReactNode} from "react";
import {ScrollView, useColorScheme, View, ViewProps} from "react-native";
import {Edge, SafeAreaView} from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import {cn} from "@/utils";
import {LinearGradient} from "expo-linear-gradient";

type ScreenProps = ViewProps & {
  children: ReactNode;
  edges?: Edge[];
  keyboard?: boolean;
  keyboardOffset?: number;
  scroll?: boolean;
  padded?: boolean;
  asBackground?: boolean;
  className?: string;
  contentClassName?: string;
};

const DEFAULT_BG = "bg-primary";
const DEFAULT_PADDING = "px-6";

export const Screen = (props: ScreenProps) => {
  const {
    children,
    edges = ["top", "bottom"],
    keyboard = false,
    keyboardOffset = 0,
    scroll = false,
    padded = false,
    asBackground = true,
    className,
    contentClassName,
    ...rest
  } = props

  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const glow: [string, string] = dark
    ? ['#022f2e', 'rgba(10,10,10,0)']
    : ['#cbfbf1', 'rgba(245,245,245,0)'];

  const inner = (
    <View className={cn("h-full w-full", padded && DEFAULT_PADDING, contentClassName)}>
      {children}
    </View>
  );

  let body: ReactNode;
  if (scroll && keyboard) {
    body = (
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={keyboardOffset}
      >
        {inner}
      </KeyboardAwareScrollView>
    );
  } else if (scroll) {
    body = (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {inner}
      </ScrollView>
    );
  } else if (keyboard) {
    body = (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding"
        keyboardVerticalOffset={keyboardOffset}
      >
        {inner}
      </KeyboardAvoidingView>
    );
  } else {
    body = inner;
  }

  return (
    <View className={cn("flex-1", DEFAULT_BG, className)} {...rest}>
      {asBackground && (
        <LinearGradient
          colors={glow}
          style={{position: 'absolute', top: 0, left: 0, right: 0, height: 150}}
        />
      )}

      <SafeAreaView className="flex-1" edges={edges}>
        {body}
      </SafeAreaView>
    </View>
  );
};

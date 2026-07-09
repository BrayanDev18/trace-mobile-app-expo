import React, {ReactNode} from "react";
import {ScrollView, View, ViewProps} from "react-native";
import {Edge, SafeAreaView} from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import {cn} from "@/utils";

type ScreenProps = ViewProps & {
  children: ReactNode;
  edges?: Edge[];
  keyboard?: boolean;
  keyboardOffset?: number;
  scroll?: boolean;
  padded?: boolean;
  background?: ReactNode;
  className?: string;
  contentClassName?: string;
};

const DEFAULT_BG = "bg-primary";
const DEFAULT_PADDING = "px-6";

export const Screen = ({
  children,
  edges = ["top", "bottom"],
  keyboard = false,
  keyboardOffset = 0,
  scroll = false,
  padded = false,
  background,
  className,
  contentClassName,
  ...rest
}: ScreenProps) => {
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
      {background}

      <SafeAreaView className="flex-1" edges={edges}>
        {body}
      </SafeAreaView>
    </View>
  );
};

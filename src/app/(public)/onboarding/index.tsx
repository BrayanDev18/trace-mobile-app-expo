import React, {useState} from "react";
import {FlatList, Pressable, StyleSheet, View, useColorScheme, useWindowDimensions} from "react-native";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {IconArrowRight} from "@tabler/icons-react-native";

import {Screen} from "@/components/Screen";
import {Text} from "@/components/Text";
import {DottedGlowBackground} from "@/components/Dottedglowbackground";
import {ScreenRoutes} from "@/constants";
import {useSessionStore} from "@/store/session";
import {cn} from "@/utils";

const SLIDES = [
  {
    title: "Sigue el rastro\nde tu dinero",
    subtitle: "Registra ingresos y gastos en segundos, sin hojas de cálculo.",
  },
  {
    title: "Descubre en qué\nse te va la plata",
    subtitle: "Categorías, estadísticas y presupuestos que te lo muestran claro.",
  },
  {
    title: "Todo tu dinero\nen un solo lugar",
    subtitle: "Deudas, suscripciones y recibos organizados y a la mano.",
  },
];

const OnboardingScreen = () => {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === "dark";
  const completeOnboarding = useSessionStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);

  const glow: [string, string] = dark
    ? ["#11402b", "rgba(10,10,10,0)"]
    : ["#d1fae5", "rgba(245,245,245,0)"];
  const fade: [string, string] = dark
    ? ["rgba(10,10,10,0)", "#0a0a0a"]
    : ["rgba(245,245,245,0)", "#f5f5f5"];

  const start = () => {
    completeOnboarding();
    router.replace(ScreenRoutes.home);
  };

  return (
    <Screen edges={["bottom"]}>
      <View className="flex-1 overflow-hidden">
        <LinearGradient colors={glow} style={StyleSheet.absoluteFill} />
        <DottedGlowBackground
          color="rgba(24,27,32,0.55)"
          darkColor="rgba(255,255,255,0.35)"
          opacity={0.12}
        />

        <Image
          source={require("@assets/screenshoot.png")}
          contentFit="cover"
          contentPosition="top"
          style={{
            flex: 1,
            width: "64%",
            alignSelf: "center",
            marginTop: insets.top + 20,
            borderRadius: 42,
            borderWidth: 5,
            borderColor: "#262626",
          }}
        />

        <LinearGradient
          colors={fade}
          style={{position: "absolute", bottom: 0, left: 0, right: 0, height: 200}}
        />
      </View>

      <View style={{ paddingBottom:insets.bottom}} className="gap-8 pt-2">
        <View className="flex-row justify-center gap-1.5">
          {SLIDES.map((slide, i) => (
            <View
              key={slide.title}
              className={cn(
                "h-2 rounded-full",
                i === index ? "w-5 bg-black dark:bg-white" : "w-2 bg-neutral-300 dark:bg-neutral-700",
              )}
            />
          ))}
        </View>

        <FlatList
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(slide) => slide.title}
          getItemLayout={(_, i) => ({length: width, offset: width * i, index: i})}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({item}) => (
            <View style={{width}} className="items-center gap-4 px-8">
              <Text className="text-center font-satoshi-bold text-4xl leading-tight tracking-tight text-primary">
                {item.title}
              </Text>

              <Text className="text-center font-satoshi text-xl leading-relaxed text-secundary">
                {item.subtitle}
              </Text>
            </View>
          )}
        />

        <View className="px-6">
          <Pressable
            onPress={start}
            className="h-16 flex-row items-center justify-between rounded-full bg-accent pl-7 pr-2 active:bg-accent-pressed"
          >
            <Text className="font-satoshi-bold text-base text-white">Comenzar</Text>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <IconArrowRight size={22} color="#ffffff" />
            </View>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
};

export default OnboardingScreen;

import {StyleSheet, View, useColorScheme} from 'react-native';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {DottedGlowBackground} from '@/components';

export const OnboardingHero = () => {
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === 'dark';

  const glow: [string, string] = dark
    ? ['#0b4f4a', 'rgba(10,10,10,0)']
    : ['#cbfbf1', 'rgba(245,245,245,0)'];
  const fade: [string, string] = dark
    ? ['rgba(10,10,10,0)', '#0a0a0a']
    : ['rgba(245,245,245,0)', '#f5f5f5'];

  return (
    <View className="flex-1 overflow-hidden">
      <LinearGradient colors={glow} style={StyleSheet.absoluteFill} />
      <DottedGlowBackground
        color="rgba(24,27,32,0.55)"
        darkColor="rgba(255,255,255,0.35)"
        opacity={0.12}
      />

      <Image
        source={require('@assets/screenshoot.png')}
        contentFit="cover"
        contentPosition="top"
        style={{
          flex: 1,
          width: '64%',
          alignSelf: 'center',
          marginTop: insets.top + 20,
          borderRadius: 42,
          borderWidth: 5,
          borderColor: '#262626',
        }}
      />

      <LinearGradient
        colors={fade}
        style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 200}}
      />
    </View>
  );
};
import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {router} from 'expo-router';
import {IconArrowRight} from '@tabler/icons-react-native';

import {Screen, Text} from '@/components';
import {ScreenRoutes} from '@/constants';
import {OnboardingHero, PageDots, SLIDES, SlideCarousel} from '@/features/onboarding';
import {useSessionStore} from '@/store/session';
import {haptic} from '@/utils';

const OnboardingScreen = () => {
  const completeOnboarding = useSessionStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);

  const start = () => {
    haptic.success();
    completeOnboarding();
    router.replace(ScreenRoutes.home);
  };

  return (
    <Screen edges={['bottom']}>
      <OnboardingHero />

      <View className="gap-12 pt-2">
        <PageDots count={SLIDES.length} index={index} />

        <SlideCarousel slides={SLIDES} onIndexChange={setIndex} />

        <View className="px-6">
          <Pressable
            onPress={start}
            className="h-16 flex-row items-center justify-between rounded-full btn-primary pl-7 pr-2 active:bg-accent-pressed"
          >
            <Text className="font-satoshi-bold text-white">Comenzar</Text>
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
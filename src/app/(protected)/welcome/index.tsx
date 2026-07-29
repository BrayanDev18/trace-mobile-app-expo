import {View} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {Screen} from '@/components';
import {SecretPanel, WelcomeLetter, useWelcomeGate} from '@/features/welcome';
import {cn} from '@/utils';

export default function WelcomeScreen() {
  const {name, unlocked, enter, slots} = useWelcomeGate();

  return (
    <Screen canGoBack={false}>
      <View className="h-full">
        <View className={cn('justify-center px-6', !unlocked && 'pb-75 pt-20')}>
          {unlocked ? (
            <Animated.View entering={FadeIn.duration(400).delay(120)}>
              <WelcomeLetter name={name} onEnter={enter}/>
            </Animated.View>
          ) : (
            <Animated.View exiting={FadeOut.duration(200)}>
              <SecretPanel {...slots} />
            </Animated.View>
          )}
        </View>
      </View>
    </Screen>
  );
}

import {Pressable, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {useTranslation} from 'react-i18next';

import {Keypad, Screen, Text} from '@/components';
import {CapturePanel} from '@/components/capture';
import {
  AuthHeading,
  OTP_LENGTH,
  OtpInput,
  useOtpVerification,
  useResendCountdown,
} from '@/features/auth';

const VerifyCodeScreen = () => {
  const {t} = useTranslation();
  const {email} = useLocalSearchParams<{email?: string}>();
  const {code, complete, keypad, verify} = useOtpVerification(email);
  const {seconds, canResend, resend} = useResendCountdown();

  return (
    <Screen edges={['top']}>
      <View className="flex-1 gap-10 px-6 pt-20">
        <AuthHeading
          title={t('auth:ui.verifyTitle')}
          subtitle={t('auth:ui.verifySubtitle', {
            digits: OTP_LENGTH,
            email: email ?? t('auth:ui.yourEmail'),
          })}
        />

        <OtpInput value={code} length={OTP_LENGTH} />

        <View className="items-center">
          {canResend ? (
            <Pressable onPress={resend} hitSlop={12} className="active:opacity-70">
              <Text className="font-satoshi-bold">{t('auth:ui.resendCode')}</Text>
            </Pressable>
          ) : (
            <Text className="text-secundary">{t('auth:ui.resendIn', {seconds})}</Text>
          )}
        </View>
      </View>

      <CapturePanel
        panel="keypad"
        submitLabel={t('auth:ui.verifyAction')}
        panelHeight={280}
        onSubmit={verify}
        disabled={!complete}
        panels={{keypad: <Keypad {...keypad} />}}
      />
    </Screen>
  );
};

export default VerifyCodeScreen;

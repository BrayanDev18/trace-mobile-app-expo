import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconMail} from '@tabler/icons-react-native';

import {Input, Button, Screen} from '@/components';
import {ScreenRoutes} from '@/constants';
import {
  AuthHeading,
  AuthSwitchLink,
  Field,
  PasswordInput,
  SocialAuth,
  useSignInForm,
  useSocialAuth,
} from '@/features/auth';

const SignInScreen = () => {
  const {t} = useTranslation();
  const {control, errors, submit} = useSignInForm();
  const socialSignIn = useSocialAuth();

  return (
    <Screen preset="scroll">
      <View className="h-screen items-center justify-center">
        <View className="gap-8 px-6 justify-center pb-28">
          <AuthHeading
            title={t('auth:ui.signInTitle')}
            subtitle={t('auth:ui.signInSubtitle')}
          />

          <SocialAuth onPress={socialSignIn}/>

          <View className="gap-8">
            <Field label={t('auth:ui.emailLabel')} error={errors.email?.message}>
              <Input
                control={control}
                name="email"
                icon={IconMail}
                placeholder={t('auth:ui.emailPlaceholder')}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                error={!!errors.email}
              />
            </Field>

            <Field label={t('auth:ui.passwordLabel')} error={errors.password?.message}>
              <PasswordInput
                control={control}
                name="password"
                placeholder={t('auth:ui.passwordPlaceholder')}
                autoComplete="current-password"
                error={!!errors.password}
              />
            </Field>
          </View>

          <Button
            label={t('auth:ui.signInAction')}
            icon={null}
            onPress={submit}
            className="h-14 active:bg-accent-pressed"
          />

          <View className="mt-auto">
            <AuthSwitchLink
              question={t('auth:ui.noAccount')}
              action={t('auth:ui.createAccount')}
              onPress={() => router.push(ScreenRoutes.signUp)}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default SignInScreen;

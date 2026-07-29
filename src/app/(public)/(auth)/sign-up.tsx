import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconMail, IconUser} from '@tabler/icons-react-native';

import {Input, Button, Screen} from '@/components';
import {ScreenRoutes} from '@/constants';
import {
  AuthHeading,
  AuthSwitchLink,
  Field,
  PasswordInput,
  SocialAuth,
  TermsCheck,
  useSignUpForm,
  useSocialAuth,
} from '@/features/auth';

const SignUpScreen = () => {
  const {t} = useTranslation();
  const {control, errors, submit} = useSignUpForm();
  const socialSignIn = useSocialAuth();

  return (
    <Screen scroll keyboard>
      <View className="p-2 h-screen items-center justify-center">
        <View className="gap-8 px-6 justify-center pb-28">

          <AuthHeading
            title={t('auth:ui.signUpTitle')}
            subtitle={t('auth:ui.signUpSubtitle')}
          />

          <SocialAuth onPress={socialSignIn}/>

          <View className="gap-8">
            <Field label={t('auth:ui.nameLabel')} error={errors.fullName?.message}>
              <Input
                control={control}
                name="fullName"
                icon={IconUser}
                placeholder={t('auth:ui.namePlaceholder')}
                autoComplete="name"
                error={!!errors.fullName}
              />
            </Field>

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
                placeholder={t('auth:ui.passwordMinPlaceholder')}
                autoComplete="new-password"
                error={!!errors.password}
              />
            </Field>

            <TermsCheck control={control} error={errors.terms?.message}/>
          </View>

          <View className="mt-auto gap-5">
            <Button
              label={t('auth:ui.signUpAction')}
              icon={null}
              onPress={submit}
              className="h-14 active:bg-accent-pressed"
            />
            <AuthSwitchLink
              question={t('auth:ui.haveAccount')}
              action={t('auth:ui.signInLink')}
              onPress={() => router.push(ScreenRoutes.signIn)}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default SignUpScreen;

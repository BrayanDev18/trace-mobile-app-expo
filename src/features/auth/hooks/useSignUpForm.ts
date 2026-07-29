import {zodResolver} from '@hookform/resolvers/zod';
import {router} from 'expo-router';
import {useForm} from 'react-hook-form';
import {Alert} from 'react-native';

import i18next from '@/i18n';
import {ScreenRoutes} from '@/constants';
import {haptic} from '@/utils';

import {signUpSchema, type SignUpFormProps} from '../schemas';
import {useAccountsStore} from '../store';

export const useSignUpForm = () => {
  const register = useAccountsStore((s) => s.register);
  const findByEmail = useAccountsStore((s) => s.findByEmail);

  const {control, handleSubmit, formState} = useForm<SignUpFormProps>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {fullName: '', email: '', password: '', terms: false},
  });

  const submit = handleSubmit(
    ({fullName, email, password}) => {
      if (findByEmail(email)) {
        haptic.error();
        Alert.alert(i18next.t('auth:errors.emailInUseTitle'), i18next.t('auth:errors.emailInUseBody'));
        return;
      }

      register({fullName, email, password});
      haptic.tap();
      router.push({pathname: ScreenRoutes.verifyCode, params: {email}});
    },
    () => haptic.error(),
  );

  return {control, errors: formState.errors, submit};
};
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Alert} from 'react-native';

import i18next from '@/i18n';
import {useSessionStore} from '@/store/session';
import {haptic} from '@/utils';

import {signInSchema, type SignInFormProps} from '../schemas';
import {useAccountsStore} from '../store';
import {goAfterAuth} from '../utils';

export const useSignInForm = () => {
  const signIn = useSessionStore((s) => s.signIn);
  const findByEmail = useAccountsStore((s) => s.findByEmail);

  const {control, handleSubmit, formState} = useForm<SignInFormProps>({
    resolver: zodResolver(signInSchema),
    defaultValues: {email: '', password: ''},
  });

  const submit = handleSubmit(
    ({email, password}) => {
      const account = findByEmail(email);

      if (!account || account.password !== password) {
        haptic.error();
        Alert.alert(i18next.t('auth:errors.signInFailedTitle'), i18next.t('auth:errors.signInFailedBody'));
        return;
      }

      haptic.success();
      signIn({name: account.fullName, email: account.email});
      goAfterAuth();
    },
    () => haptic.error(),
  );

  return {control, errors: formState.errors, submit};
};
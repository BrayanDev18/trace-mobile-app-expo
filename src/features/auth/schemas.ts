import {z} from 'zod';

import i18next from '@/i18n';

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, {error: () => i18next.t('auth:validation.nameRequired')}),
  email: z.email({error: () => i18next.t('auth:validation.email')}),
  password: z.string().min(8, {error: () => i18next.t('auth:validation.passwordMin')}),
  terms: z.boolean().refine(Boolean, {error: () => i18next.t('auth:validation.terms')}),
});

export const signInSchema = z.object({
  email: z.email({error: () => i18next.t('auth:validation.email')}),
  password: z.string().min(1, {error: () => i18next.t('auth:validation.passwordRequired')}),
});

export type SignUpFormProps = z.infer<typeof signUpSchema>;
export type SignInFormProps = z.infer<typeof signInSchema>;
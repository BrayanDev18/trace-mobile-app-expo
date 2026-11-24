import {Alert, View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconBell, IconCash, IconCoin, IconHistory, IconUser} from '@tabler/icons-react-native';

import {
  Group,
  GroupAction,
  Header,
  LanguageSelector,
  NavRow,
  Screen,
  SectionTitle,
  Separator,
  Text,
  ThemeSelector,
  UpgradeCard,
} from '@/components';
import {ScreenRoutes} from '@/constants';
import {useIncomeStore} from '@/features/income';
import {useResetData} from '@/hooks/useResetData';
import {useLocaleStore} from '@/store/locale';
import {useSessionStore} from '@/store/session';
import {useThemeStore} from '@/store/theme';
import {confirmDestructive, formatCurrency, isOwner} from '@/utils';

export default function ProfileScreen() {
  const {t} = useTranslation();
  const user = useSessionStore((s) => s.user);
  const signOut = useSessionStore((s) => s.signOut);
  const theme = useThemeStore((s) => s.preference);
  const setTheme = useThemeStore((s) => s.setPreference);
  const locale = useLocaleStore((s) => s.preference);
  const setLocale = useLocaleStore((s) => s.setPreference);
  const resetData = useResetData();
  const incomeConfig = useIncomeStore((s) => s.config);

  if (!user) return null;

  const owner = isOwner(user.email);
  const soon = () => Alert.alert(t('common:states.comingSoon'), t('common:states.comingSoonBody'));

  const incomeValue = !incomeConfig
    ? t('income:profile.empty')
    : incomeConfig.amount
      ? t('income:profile.value', {
        amount: `$${formatCurrency(incomeConfig.amount)}`,
        frequency: t(`income:frequency.${incomeConfig.frequency}`),
      })
      : t(`income:frequency.${incomeConfig.frequency}`);

  const logout = () =>
    confirmDestructive({
      title: t('profile:logout.confirmTitle'),
      message: t('profile:logout.confirmBody'),
      actionLabel: t('profile:logout.action'),
      onConfirm: () => {
        signOut();
        router.replace(ScreenRoutes.signIn);
      },
    });

  const onReset = () =>
    confirmDestructive({
      title: t('profile:reset.confirmTitle'),
      message: t('profile:reset.confirmBody'),
      actionLabel: t('profile:reset.action'),
      onConfirm: resetData,
    });

  return (
    <Screen safeAreaEdges={["top"]} preset="scroll" canGoBack={false}>
      <Header title={t('profile:title')}/>

      <View className="gap-8 px-5 pb-10 pt-2">
        <View className="items-center gap-3">
          <View className="h-20 w-20 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
            <Text className="font-satoshi-bold text-3xl text-accent dark:text-teal-400">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View className="items-center gap-0.5">
            <Text className="font-satoshi-bold text-xl">{user.name}</Text>
            {user.email ? <Text className="text-secundary">{user.email}</Text> : null}
          </View>
        </View>

        <UpgradeCard
          active={owner}
          badge={t('profile:pro.badge')}
          title={t(owner ? 'profile:pro.owner.title' : 'profile:pro.title')}
          description={t(owner ? 'profile:pro.owner.description' : 'profile:pro.description')}
          action={t('profile:pro.action')}
          status={t('profile:pro.owner.status')}
          onPress={soon}
        />

        <View className="gap-2">
          <SectionTitle>{t('profile:account')}</SectionTitle>

          <Group>
            <NavRow
              icon={IconCash}
              label={t('income:profile.label')}
              value={incomeValue}
              onPress={() => router.push(ScreenRoutes.incomeSetup)}
            />

            {incomeConfig ? (
              <>
                <Separator/>
                <NavRow
                  icon={IconHistory}
                  label={t('income:profile.history')}
                  onPress={() => router.push(ScreenRoutes.cycles)}
                />
              </>
            ) : null}

            <Separator/>
            <NavRow icon={IconUser} label={t('profile:editProfile')} onPress={soon}/>
            <Separator/>
            <NavRow icon={IconBell} label={t('profile:notifications')} onPress={soon}/>
            <Separator/>
            <NavRow icon={IconCoin} label={t('profile:currency')} onPress={soon}/>
          </Group>
        </View>

        <View className="gap-2">
          <SectionTitle>{t('profile:appearance')}</SectionTitle>

          <ThemeSelector value={theme} onChange={setTheme}/>
        </View>

        <View className="gap-2">
          <SectionTitle>{t('profile:language')}</SectionTitle>

          <LanguageSelector value={locale} onChange={setLocale}/>
        </View>

        <GroupAction
          destructive
          label={t('profile:reset.action')}
          caption={t('profile:reset.caption')}
          onPress={onReset}
        />

        <GroupAction
          destructive
          label={t('profile:logout.action')}
          caption={t('profile:logout.caption')}
          onPress={logout}
        />
      </View>
    </Screen>
  );
}

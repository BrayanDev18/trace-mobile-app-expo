import {Pressable, View} from 'react-native';
import {IconCheck} from '@tabler/icons-react-native';
import {useTranslation} from 'react-i18next';

import {Group, Separator} from '@/components/Group';
import {Text} from '@/components/Text';
import {useIconColors} from '@/hooks/useIconColors';
import type {LocalePreferenceProps} from '@/store/locale';

const OPTIONS: {value: LocalePreferenceProps; labelKey: string}[] = [
  {value: 'system', labelKey: 'common:language.system'},
  {value: 'es', labelKey: 'common:language.es'},
  {value: 'en', labelKey: 'common:language.en'},
];

type LanguageSelectorProps = {
  value: LocalePreferenceProps;
  onChange: (value: LocalePreferenceProps) => void;
};

export const LanguageSelector = ({value, onChange}: LanguageSelectorProps) => {
  const {t} = useTranslation();
  const accent = useIconColors().accent;

  return (
    <Group>
      {OPTIONS.map((option, index) => (
        <View key={option.value}>
          {index > 0 ? <Separator /> : null}

          <Pressable
            onPress={() => onChange(option.value)}
            className="min-h-14 flex-row items-center justify-between px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
          >
            <Text className="font-satoshi-medium">{t(option.labelKey)}</Text>
            {value === option.value ? <IconCheck size={20} color={accent} /> : null}
          </Pressable>
        </View>
      ))}
    </Group>
  );
};

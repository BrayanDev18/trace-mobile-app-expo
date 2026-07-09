import {Pressable, StyleSheet, View, useColorScheme} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {IconPlus} from '@tabler/icons-react-native';

import {DottedGlowBackground, Text} from '@/components';
import {formatCurrency} from '@/utils';

import {HERO_GRADIENT} from './heroGradient';

type SubscriptionsBannerProps = {
  monthlyTotal: number;
  count: number;
  onAdd?: () => void;
};

export const SubscriptionsBanner = ({monthlyTotal, count, onAdd}: SubscriptionsBannerProps) => {
  const dark = useColorScheme() === 'dark';

  return (
    <View className="overflow-hidden rounded-3xl">
      <LinearGradient
        colors={dark ? HERO_GRADIENT.dark : HERO_GRADIENT.light}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <DottedGlowBackground
        color="rgba(24,27,32,0.55)"
        darkColor="rgba(255,255,255,0.6)"
        gap={14}
        radius={1.5}
        opacity={0.12}
      />

      <View className="gap-5 p-5">
        <View className="gap-1">
          <Text className="font-satoshi-medium text-sm text-neutral-600 dark:text-white/80">
            Gasto mensual en suscripciones
          </Text>
          <Text
            numberOfLines={1}
            className="font-satoshi-bold text-4xl tracking-tight text-primary"
            style={{fontVariant: ['tabular-nums']}}
          >
            $ {formatCurrency(monthlyTotal)}
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-white/80">
            {count} {count === 1 ? 'suscripción activa' : 'suscripciones activas'}
          </Text>
        </View>

        <Pressable
          onPress={onAdd}
          className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-black/5  active:bg-black/10 dark:bg-white/15 dark:active:bg-white/25"
        >
          <IconPlus size={18} color={dark ? '#ffffff' : '#171717'} />
          <Text className="font-satoshi-bold text-sm text-primary">Agregar suscripción</Text>
        </Pressable>
      </View>
    </View>
  );
};

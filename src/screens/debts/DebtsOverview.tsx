import {Pressable, View, useColorScheme} from 'react-native';
import {IconPlus} from '@tabler/icons-react-native';

import {DottedGlowBackground, Text} from '@/components';
import {cn, formatCurrency} from '@/utils';

type DebtsOverviewProps = {
  lent: number;
  owed: number;
  count: number;
  onAdd?: () => void;
};

export const DebtsOverview = (props: DebtsOverviewProps) => {
  const {lent, owed, count, onAdd} = props;

  const dark = useColorScheme() === 'dark';
  const net = lent - owed;
  const display = formatCurrency(Math.abs(net));
  const size = display.length > 9 ? 'text-4xl' : 'text-5xl';

  return (
    <View className="overflow-hidden rounded-3xl">
      <DottedGlowBackground
        color="rgba(24,27,38,0.55)"
        darkColor="rgba(255,255,255,0.6)"
        gap={14}
        radius={1.5}
        opacity={0.12}
      />

      <View className="gap-5 p-5">
        <View className="gap-3">
          <Text className="text-sm text-secundary">Balance de deudas</Text>
          <Text
            numberOfLines={1}
            className={cn('font-satoshi-bold tracking-tight', size)}
            style={{fontVariant: ['tabular-nums']}}
          >
            {net < 0 ? '-' : ''}$ {display}
          </Text>
          <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
            Te deben $ {formatCurrency(lent)} · Debes $ {formatCurrency(owed)} · {count}{' '}
            {count === 1 ? 'activa' : 'activas'}
          </Text>
        </View>

        <Pressable
          onPress={onAdd}
          className="h-12 flex-row items-center justify-center gap-2 rounded-full btn-primary"
        >
          <IconPlus size={18} color={dark ? '#ffffff' : '#171717'} />
          <Text className="font-satoshi-bold text-sm">Nueva deuda</Text>
        </Pressable>
      </View>
    </View>
  );
};
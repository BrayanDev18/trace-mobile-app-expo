import {ReactNode, useState} from 'react';
import {Alert, Pressable, View, useColorScheme} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {Image} from 'expo-image';
import * as Haptics from 'expo-haptics';
import {IconChevronRight, IconPencil} from '@tabler/icons-react-native';

import {Group, Header, Screen, Separator, SheetModal, Text} from '@/components';
import {getCategory, getPaymentMethod} from '@/constants';
import {useMovementsStore} from '@/store/movements';
import {cn, formatCurrency, longDate, relativeDate} from '@/utils';

const isIOS = process.env.EXPO_OS === 'ios';

const Row = ({label, children}: {label: string; children: ReactNode}) => (
  <View className="min-h-14 flex-row items-center justify-between gap-4 px-4 py-3">
    <Text className="font-satoshi-medium">{label}</Text>
    <View className="flex-1 flex-row items-center justify-end gap-2">{children}</View>
  </View>
);

export default function ExpenseDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const scheme = useColorScheme();
  const faint = scheme === 'dark' ? '#525252' : '#a3a3a3';

  const [receiptOpen, setReceiptOpen] = useState(false);

  const movements = useMovementsStore((s) => s.items);
  const remove = useMovementsStore((s) => s.remove);
  const movement = movements.find((m) => m.id === id);

  if (!movement) return null;

  const isIncome = movement.type === 'income';
  const date = new Date(movement.date);
  const category = getCategory(movement.categoryId);
  const method = movement.methodId ? getPaymentMethod(movement.methodId) : undefined;
  const CategoryIcon = category.icon;

  const display = formatCurrency(movement.amount);
  const amountSize = display.length > 9 ? 'text-4xl' : display.length > 6 ? 'text-5xl' : 'text-6xl';

  const confirmDelete = () => {
    Alert.alert(
      isIncome ? '¿Eliminar ingreso?' : '¿Eliminar gasto?',
      'Se eliminará de tu historial. Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            remove(movement.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <Screen edges={['top']} scroll>
      <Header
        title={isIncome ? 'Detalle del ingreso' : 'Detalle del gasto'}
        rightIcon={IconPencil}
      />

      <View className="items-center gap-3 px-6 pb-10 pt-8">
        <View className="items-center gap-4">
          <Text
            selectable
            numberOfLines={2}
            className="text-center font-satoshi-medium"
          >
            {movement.reason}
          </Text>
          <Text
            selectable
            numberOfLines={1}
            className={cn(
              'font-satoshi-bold tracking-tight',
              amountSize,
              isIncome && 'text-accent dark:text-teal-400',
            )}
            style={{fontVariant: ['tabular-nums']}}
          >
            {isIncome ? '+' : '-'}${display}
          </Text>
          <Text className="text-sm text-secundary">
            {relativeDate(date)}
          </Text>
        </View>
      </View>

      <View className="gap-8 px-5 pb-10">
        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium">Detalles</Text>

          <Group>
            <Row label="Categoría">
              <CategoryIcon size={17} color={category.tint} />
              <Text className="text-secundary">{category.label}</Text>
            </Row>
            <Separator />
            <Row label="Método de pago">
              {method ? <method.Icon size={17} /> : null}
              <Text className="text-secundary">{method?.label ?? '—'}</Text>
            </Row>
            <Separator />
            <Row label="Fecha">
              <Text selectable className="text-secundary">
                {longDate(date)}
              </Text>
            </Row>
            <Separator />
            {movement.receiptUri ? (
              <Pressable
                accessibilityLabel="Ver factura"
                onPress={() => setReceiptOpen(true)}
                className="active:bg-neutral-200 dark:active:bg-white/5"
              >
                <Row label="Factura">
                  <Image
                    source={{uri: movement.receiptUri}}
                    style={{width: 28, height: 28, borderRadius: 6}}
                    contentFit="cover"
                  />
                  <IconChevronRight size={16} color={faint} />
                </Row>
              </Pressable>
            ) : (
              <Row label="Factura">
                <Text className="text-secundary">Ninguna</Text>
              </Row>
            )}
          </Group>
        </View>

        <View className="gap-2">
          <Group>
            <Pressable
              onPress={confirmDelete}
              className="min-h-14 items-center justify-center px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
            >
              <Text className="text-red-400 font-satoshi-medium text-lg">
                {isIncome ? 'Eliminar ingreso' : 'Eliminar gasto'}
              </Text>
            </Pressable>
          </Group>
          <Text className="px-4 text-xs text-secundary">
            Se eliminará de tu historial. Esta acción no se puede deshacer.
          </Text>
        </View>
      </View>

      <SheetModal visible={receiptOpen} onClose={() => setReceiptOpen(false)} title="Factura">
        {movement.receiptUri ? (
          <Image
            source={{uri: movement.receiptUri}}
            style={{width: '100%', height: 420, borderRadius: 20}}
            contentFit="cover"
          />
        ) : null}
      </SheetModal>
    </Screen>
  );
}

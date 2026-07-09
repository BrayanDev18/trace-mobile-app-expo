import {ReactNode, useState} from 'react';
import {Alert, Pressable, View, useColorScheme} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {Image} from 'expo-image';
import * as Haptics from 'expo-haptics';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react-native';

import {Group, Screen, Separator, SheetModal, Text} from '@/components';
import {getCategory, getPaymentMethod} from '@/constants';
import {useMovementsStore} from '@/store/movements';
import {cn, formatCurrency, longDate, relativeDate} from '@/utils';

const isIOS = process.env.EXPO_OS === 'ios';

const Row = ({label, children}: {label: string; children: ReactNode}) => (
  <View className="min-h-14 flex-row items-center justify-between gap-4 px-4 py-3">
    <Text className="text-primary">{label}</Text>
    <View className="flex-1 flex-row items-center justify-end gap-2">{children}</View>
  </View>
);

export default function ExpenseDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const scheme = useColorScheme();
  const tint = scheme === 'dark' ? '#34d399' : '#059669';
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
      <View className="h-12 flex-row items-center justify-between px-3">
        <Pressable
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center active:opacity-50"
        >
          <IconChevronLeft size={26} color={tint} />
        </Pressable>
        <Text className="font-satoshi-bold text-base text-primary">
          {isIncome ? 'Detalle del ingreso' : 'Detalle del gasto'}
        </Text>
        <Pressable hitSlop={8} className="h-10 items-center justify-center px-2 active:opacity-50">
          <Text className="text-base" style={{color: tint}}>
            Editar
          </Text>
        </Pressable>
      </View>

      <View className="items-center gap-3 px-6 pb-10 pt-8">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{backgroundColor: `${category.tint}1f`}}
        >
          <CategoryIcon size={20} color={category.tint} />
        </View>

        <View className="items-center gap-1">
          <Text
            selectable
            numberOfLines={2}
            className="text-center font-satoshi-medium text-primary"
          >
            {movement.reason}
          </Text>
          <Text
            selectable
            numberOfLines={1}
            className={cn(
              'font-satoshi-bold tracking-tight',
              amountSize,
              isIncome ? 'text-accent dark:text-emerald-400' : 'text-primary',
            )}
            style={{fontVariant: ['tabular-nums']}}
          >
            {isIncome ? '+' : '-'}${display}
          </Text>
          <Text className="font-satoshi text-sm text-secundary">
            {relativeDate(date)}
          </Text>
        </View>
      </View>

      <View className="gap-8 px-5 pb-10">
        <View className="gap-2">
          <Text className="px-4 text-xs text-secundary">Detalles</Text>
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
                <Text className="text-neutral-400 dark:text-neutral-600">Ninguna</Text>
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
              <Text className="text-red-400">
                {isIncome ? 'Eliminar ingreso' : 'Eliminar gasto'}
              </Text>
            </Pressable>
          </Group>
          <Text className="px-4 text-xs text-neutral-400 dark:text-neutral-600">
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

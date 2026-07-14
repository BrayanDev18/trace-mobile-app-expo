import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {Image} from 'expo-image';
import {IconChevronRight} from '@tabler/icons-react-native';

import {Group, Header, Row, Screen, Separator, SheetModal, Text,DetailHero,GroupAction} from '@/components';
import {getCategory, getPaymentMethod} from '@/constants';
import {useIconColors} from '@/hooks/useIconColors';
import {useMovementsStore} from '@/features/expenses';
import {longDate, relativeDate,confirmDestructive} from '@/utils';

export default function ExpenseDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const {faint} = useIconColors();

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

  const deleteConfirm = () =>
    confirmDestructive({
      title: isIncome ? '¿Eliminar ingreso?' : '¿Eliminar gasto?',
      message: 'Se eliminará de tu historial. Esta acción no se puede deshacer.',
      actionLabel: 'Eliminar',
      onConfirm: () => {
        remove(movement.id);
        router.back();
      },
    });

  return (
    <Screen edges={['top']} scroll>
      <Header title={isIncome ? 'Detalle del ingreso' : 'Detalle del gasto'} />

      <DetailHero
        title={movement.reason}
        amount={movement.amount}
        prefix={isIncome ? '+' : '-'}
        accent={isIncome}
        meta={relativeDate(date)}
      />

      <View className="gap-8 px-5 pb-10">
        <View className="gap-2">
          <Text className="px-4 font-satoshi-medium text-lg">Detalles</Text>

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

        <GroupAction
          destructive
          label={isIncome ? 'Eliminar ingreso' : 'Eliminar gasto'}
          caption="Se eliminará de tu historial. Esta acción no se puede deshacer."
          onPress={deleteConfirm}
        />
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

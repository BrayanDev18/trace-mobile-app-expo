import {useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {IconCalendarEvent, IconCreditCard} from '@tabler/icons-react-native';

import {Keypad, Screen} from '@/components';
import {AmountDisplay,CapturePanel,DatePanel,FormSheetHeader,PickerChip,PillPicker,SegmentChips} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {PAYMENT_METHODS, getPaymentMethod} from '@/constants';
import {BrandSearch,BrandSummary,useSubscriptionForm} from '@/features/subscriptions';
import {type Subscription} from '@/features/subscriptions';
import {haptic, shortDate} from '@/utils';

type Panel = 'keypad' | 'date' | 'method';

const PERIODS: {value: Subscription['period']; label: string}[] = [
  {value: 'monthly', label: 'Mensual'},
  {value: 'yearly', label: 'Anual'},
];

const METHOD_OPTIONS = PAYMENT_METHODS.map((m) => ({id: m.id, label: m.label, icon: m.Icon}));

export default function NewSubscriptionScreen() {
  const [panel, setPanel] = useState<Panel>('keypad');
  const form = useSubscriptionForm();

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => form.price,
    onChange: form.setPrice,
  });

  const method = form.methodId ? getPaymentMethod(form.methodId) : undefined;

  const togglePanel = (target: Panel) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  return (
    <Screen edges={['top']} scroll={!form.brand} keyboard={!form.brand} asBackground={false}>
      <FormSheetHeader title="Nueva suscripción" onClose={router.back} />

      {!form.brand ? (
        <BrandSearch onPick={form.setBrand} />
      ) : (
        <View className="flex-1 pt-4">
          <View className="px-5">
            <BrandSummary brand={form.brand} onChange={() => form.setBrand(null)} />
          </View>

          <View className="flex-1 items-center justify-center">
            <AmountDisplay
              raw={form.price}
              animatedStyle={animatedStyle}
              error={form.attempted && !form.amountValid}
              suffix={`/${form.period === 'yearly' ? 'año' : 'mes'}`}
            />
          </View>

          <CapturePanel
            panel={panel}
            submitLabel="Agregar suscripción"
            onSubmit={() => form.submit(shakeError)}
            chips={
              <>
                <SegmentChips options={PERIODS} value={form.period} onChange={form.setPeriod} />

                <PickerChip
                  icon={IconCalendarEvent}
                  label={shortDate(form.date)}
                  active={panel === 'date'}
                  onPress={() => togglePanel('date')}
                />

                <PickerChip
                  icon={method?.Icon ?? IconCreditCard}
                  label={method?.label ?? 'Método'}
                  active={panel === 'method'}
                  onPress={() => togglePanel('method')}
                />
              </>
            }
            panels={{
              keypad: <Keypad onKey={onKey} onErase={erase} onClear={clear} />,
              date: (
                <DatePanel
                  selected={form.date}
                  onSelect={(d) => {
                    form.setDate(d);
                    setPanel('keypad');
                  }}
                />
              ),
              method: (
                <PillPicker
                  options={METHOD_OPTIONS}
                  selectedId={form.methodId}
                  onSelect={(id) => {
                    form.setMethodId(id);
                    setPanel('keypad');
                  }}
                />
              ),
            }}
          />
        </View>
      )}
    </Screen>
  );
}
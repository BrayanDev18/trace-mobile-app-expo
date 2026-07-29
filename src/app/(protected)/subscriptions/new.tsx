import {useState} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {IconCalendarEvent, IconCreditCard} from '@tabler/icons-react-native';

import {Keypad, Screen} from '@/components';
import {AmountDisplay,CapturePanel,DatePanel,FormSheetHeader,PickerChip,PillPicker,SegmentChips} from '@/components/capture';
import {useAmountInput} from '@/hooks/useAmountInput';
import {PAYMENT_METHODS, getPaymentMethod} from '@/constants';
import {BrandSearch,BrandSummary,useSubscriptionForm} from '@/features/subscriptions';
import {type SubscriptionProps} from '@/features/subscriptions';
import {haptic, shortDate} from '@/utils';

type PanelProps = 'keypad' | 'date' | 'method';

export default function NewSubscriptionScreen() {
  const {t} = useTranslation();
  const [panel, setPanel] = useState<PanelProps>('keypad');
  const form = useSubscriptionForm();
  const methodOptions = PAYMENT_METHODS.map((m) => ({id: m.id, label: t(m.labelKey), icon: m.Icon}));

  const periods: {value: SubscriptionProps['period']; label: string}[] = [
    {value: 'monthly', label: t('subscriptions:period.monthly')},
    {value: 'yearly', label: t('subscriptions:period.yearly')},
  ];

  const {animatedStyle, onKey, erase, clear, shakeError} = useAmountInput({
    getValue: () => form.price,
    onChange: form.setPrice,
  });

  const method = form.methodId ? getPaymentMethod(form.methodId) : undefined;

  const togglePanel = (target: PanelProps) => {
    haptic.select();
    setPanel((prev) => (prev === target ? 'keypad' : target));
  };

  return (
    <Screen edges={['top']} scroll={!form.brand} keyboard={!form.brand} asBackground={false} canGoBack={false}>
      <FormSheetHeader title={t('subscriptions:new.title')} onClose={router.back} />

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
              suffix={`/${t(form.period === 'yearly' ? 'subscriptions:period.year' : 'subscriptions:period.month')}`}
            />
          </View>

          <CapturePanel
            panel={panel}
            submitLabel={t('subscriptions:actions.add')}
            onSubmit={() => form.submit(shakeError)}
            chips={
              <>
                <SegmentChips options={periods} value={form.period} onChange={form.setPeriod} />

                <PickerChip
                  icon={IconCalendarEvent}
                  label={shortDate(form.date)}
                  active={panel === 'date'}
                  onPress={() => togglePanel('date')}
                />

                <PickerChip
                  icon={method?.Icon ?? IconCreditCard}
                  label={method ? t(method.labelKey) : t('subscriptions:new.methodPlaceholder')}
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
                  options={methodOptions}
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
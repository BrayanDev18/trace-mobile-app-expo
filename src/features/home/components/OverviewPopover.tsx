import {Modal, Pressable, StyleSheet, View, useColorScheme} from 'react-native';
import {IconCheck} from '@tabler/icons-react-native';

import {Text} from '@/components';
import {formatCurrency} from '@/utils';

export type Overview = {label: string; value: number};

type OverviewPopoverProps = {
  visible: boolean;
  anchor: {x: number; y: number; width: number; height: number};
  overviews: Overview[];
  selected: number;
  onSelect: (index: number) => void;
  onClose: () => void;
};

export const OverviewPopover = (props: OverviewPopoverProps) => {
  const {visible, anchor, overviews, selected, onSelect, onClose} = props;

  const scheme = useColorScheme();
  const check = scheme === 'dark' ? '#00d5be' : '#009689';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          className="absolute rounded-2xl border border-neutral-200 bg-secundary p-1.5 dark:border-neutral-800"
          style={{
            top: anchor.y + anchor.height + 8,
            left: anchor.x,
            minWidth: 220,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: {width: 0, height: 1},
          }}
        >
          {overviews.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => onSelect(index)}
              className="flex-row items-center justify-between gap-6 rounded-xl px-3 py-2.5 active:bg-neutral-200 dark:active:bg-white/5"
            >
              <View>
                <Text className="font-satoshi-medium">
                  {item.label}
                </Text>
                <Text
                  className="text-xs text-secundary"
                  numberOfLines={1}
                  style={{fontVariant: ['tabular-nums']}}
                >
                  $ {formatCurrency(item.value)}
                </Text>
              </View>
              {index === selected && <IconCheck size={18} color={check} />}
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

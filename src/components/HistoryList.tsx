import {Fragment} from 'react';
import {Pressable, View} from 'react-native';

import {Group, Separator} from '@/components/Group';
import {Text} from '@/components/Text';
import {formatCurrency, relativeDate} from '@/utils';

export type HistoryItem = {
  id: string;
  date: string;
  amount: number;
};

type HistoryListProps = {
  title: string;
  items: HistoryItem[];
  emptyLabel: string;
  hint: string;
  onRemove: (item: HistoryItem) => void;
};

export const HistoryList = (props: HistoryListProps) => {
  const {title, items, emptyLabel, hint, onRemove} = props;

  return (
    <View className="gap-2">
      <Text className="px-4 font-satoshi-medium text-lg">{title}</Text>

      <Group>
        {items.length === 0 ? (
          <View className="min-h-14 items-center justify-center px-4 py-3">
            <Text className="text-secundary">{emptyLabel}</Text>
          </View>
        ) : (
          items.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && <Separator />}
              <Pressable
                onLongPress={() => onRemove(item)}
                className="min-h-14 flex-row items-center justify-between px-4 py-3 active:bg-neutral-200 dark:active:bg-white/5"
              >
                <Text>{relativeDate(new Date(item.date))}</Text>
                <Text
                  className="text-accent dark:text-teal-400"
                  style={{fontVariant: ['tabular-nums']}}
                >
                  +${formatCurrency(item.amount)}
                </Text>
              </Pressable>
            </Fragment>
          ))
        )}
      </Group>

      {items.length > 0 && <Text className="px-4 text-xs text-secundary">{hint}</Text>}
    </View>
  );
};
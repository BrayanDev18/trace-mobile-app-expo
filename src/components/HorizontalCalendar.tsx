import {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, Pressable, View, type ViewToken} from 'react-native';

import {Text} from '@/components/Text';
import {cn} from '@/utils';

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_WIDTH = 52;
const RANGE = 365;
const VIEWABILITY_CONFIG = {itemVisiblePercentThreshold: 50};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => {
  const next = startOfDay(d);
  next.setDate(next.getDate() + n);
  return next;
};
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

type HorizontalCalendarProps = {
  selected: Date;
  onSelect: (date: Date) => void;
};

export const HorizontalCalendar = ({selected, onSelect}: HorizontalCalendarProps) => {
  const listRef = useRef<FlatList<Date>>(null);

  const {days, today} = useMemo(() => {
    const base = startOfDay(new Date());
    const list: Date[] = [];
    for (let i = -RANGE; i <= RANGE; i++) list.push(addDays(base, i));
    return {days: list, today: base};
  }, []);

  const selectedIndex = useMemo(
    () => days.findIndex((d) => isSameDay(d, selected)),
    [days, selected],
  );

  const [visible, setVisible] = useState({
    month: selected.getMonth(),
    year: selected.getFullYear(),
  });

  const onViewableItemsChanged = useCallback(({viewableItems}: {viewableItems: ViewToken[]}) => {
    if (!viewableItems.length) return;
    const mid = viewableItems[Math.floor(viewableItems.length / 2)].item as Date;
    setVisible((prev) =>
      prev.month === mid.getMonth() && prev.year === mid.getFullYear()
        ? prev
        : {month: mid.getMonth(), year: mid.getFullYear()},
    );
  }, []);

  const monthLabel = `${MONTHS[visible.month]}${
    visible.year !== today.getFullYear() ? ` ${visible.year}` : ''
  }`;

  return (
    <View className="gap-3">
      <Text className="font-satoshi-bold text-3xl tracking-tight text-primary">
        {monthLabel}
      </Text>

      <FlatList
        ref={listRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(d) => d.toISOString()}
        getItemLayout={(_, index) => ({
          length: DAY_WIDTH,
          offset: DAY_WIDTH * index,
          index,
        })}
        initialScrollIndex={Math.max(selectedIndex - 3, 0)}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        renderItem={({item}) => {
          const active = isSameDay(item, selected);
          const isToday = isSameDay(item, today);

          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={{width: DAY_WIDTH}}
              className="items-center gap-2 py-1"
            >
              <Text className="font-semibold text-sm text-secundary">
                {WEEKDAYS[item.getDay()]}
              </Text>

              <View
                className={cn(
                  'w-10 h-10 rounded-full items-center justify-center',
                  active && 'bg-black dark:bg-white',
                )}
              >
                <Text
                  className={cn(
                    'font-satoshi-medium',
                    active
                      ? 'text-white dark:text-black'
                      : isToday
                        ? 'text-accent dark:text-emerald-400'
                        : 'text-primary',
                  )}
                >
                  {item.getDate()}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

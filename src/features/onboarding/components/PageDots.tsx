import {View} from 'react-native';

import {cn} from '@/utils';

type PageDotsProps = {
  count: number;
  index: number;
};

export const PageDots = ({count, index}: PageDotsProps) => (
  <View className="flex-row justify-center gap-1.5">
    {Array.from({length: count}, (_, i) => (
      <View
        key={i}
        className={cn(
          'h-2 rounded-full',
          i === index
            ? 'w-5 bg-neutral-900 dark:bg-white'
            : 'w-2 bg-neutral-300 dark:bg-neutral-700',
        )}
      />
    ))}
  </View>
);
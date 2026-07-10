import {View} from 'react-native';

import {cn} from '@/utils';

type ProgressBarProps = {
  progress: number;
  className?: string;
};

export const ProgressBar = ({progress, className}: ProgressBarProps) => (
  <View
    className={cn('h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800', className)}
  >
    <View
      className="h-full rounded-full bg-accent"
      style={{width: `${Math.min(100, Math.max(0, progress * 100))}%`}}
    />
  </View>
);
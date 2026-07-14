import {View} from 'react-native';

type ListGapProps = {
  size?: 2 | 3;
};

export const ListGap = ({size = 3}: ListGapProps) => (
  <View className={size === 2 ? 'h-2' : 'h-3'} />
);

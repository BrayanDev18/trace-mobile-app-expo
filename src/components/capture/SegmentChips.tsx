import {Chip} from '@/components/Chip';
import {Text} from '@/components/Text';
import {cn, haptic} from '@/utils';

type SegmentChipsProps<T extends string> = {
  options: {value: T; label: string}[];
  value: T;
  onChange: (value: T) => void;
};

export const SegmentChips = <T extends string>({options, value, onChange}: SegmentChipsProps<T>) => (
  <>
    {options.map((option) => {
      const active = value === option.value;

      return (
        <Chip
          key={option.value}
          onPress={() => {
            haptic.select();
            onChange(option.value);
          }}
          className={cn(active && 'btn-primary')}
        >
          <Text className={cn('text-sm', active ? 'font-satoshi-bold text-white' : 'font-satoshi-medium')}>
            {option.label}
          </Text>
        </Chip>
      );
    })}
  </>
);
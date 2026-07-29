import type {ReactNode} from 'react';
import {TextInput, View} from 'react-native';
import {useColorScheme} from '@/hooks/useColorScheme';
import type {TextInputProps} from 'react-native';
import {Controller, type Control, type FieldValues, type Path} from 'react-hook-form';
import type {Icon} from '@tabler/icons-react-native';

import {cn} from '@/utils';
import {useIconColors} from '@/hooks/useIconColors';

type BaseInputProps = Omit<TextInputProps, 'value'> & {
  icon?: Icon;
  trailing?: ReactNode;
  error?: boolean;
};

export type InputProps<T extends FieldValues> = BaseInputProps & {
  control?: Control<T>;
  name?: Path<T>;
};

export const Input = <T extends FieldValues = FieldValues>({
  control,
  name,
  ...props
}: InputProps<T>) => {
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({field: {value, onChange, onBlur}}) => (
          <BaseInput
            {...props}
            defaultValue={typeof value === 'string' ? value : undefined}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
    );
  }

  return <BaseInput {...props} />;
};

const BaseInput = (props: BaseInputProps) => {
  const {icon: LeadingIcon, trailing, error, className, ...rest} = props;

  const dark = useColorScheme() === 'dark';
  const {faint} = useIconColors();

  return (
    <View
      className={cn(
        'h-14 w-full flex-row items-center gap-2 rounded-full bg-secundary px-5',
        error && 'border border-red-400',
      )}
      style={dark ? undefined : {boxShadow: '0 1px 6px rgba(0,0,0,0.05)'}}
    >
      {LeadingIcon && <LeadingIcon size={16} color={faint} />}
      <TextInput
        placeholderTextColor={faint}
        className={cn('h-full flex-1 font-satoshi-medium text-primary', className)}
        {...rest}
      />
      {trailing}
    </View>
  );
};

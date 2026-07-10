import {TextInput, View, useColorScheme} from 'react-native';
import type {TextInputProps} from 'react-native';
import {Controller, type Control, type FieldValues, type Path} from 'react-hook-form';
import type {Icon} from '@tabler/icons-react-native';

import {cn} from '@/utils';

/**
 * Input no controlado por diseño: no acepta `value` para evitar el
 * round-trip nativo↔JS que hace parpadear las letras al escribir.
 * Solo: `defaultValue` + `onChangeText`, o `control` + `name` (RHF).
 */
type BaseInputProps = Omit<TextInputProps, 'value'> & {
  icon?: Icon;
  error?: boolean;
  containerClassName?: string;
};

const BaseInput = (props: BaseInputProps) => {
  const {icon: LeadingIcon, error, containerClassName, className, ...rest} = props;

  const dark = useColorScheme() === 'dark';
  const faint = dark ? '#525252' : '#a3a3a3';

  return (
    <View
      className={cn(
        'h-14 w-full flex-row items-center gap-2 rounded-full bg-secundary px-5',
        error && 'border border-red-400',
        containerClassName,
      )}
      style={dark ? undefined : {boxShadow: '0 1px 6px rgba(0,0,0,0.05)'}}
    >
      {LeadingIcon && <LeadingIcon size={16} color={faint} />}
      <TextInput
        placeholderTextColor={faint}
        className={cn('h-full flex-1 font-satoshi-medium text-primary', className)}
        {...rest}
      />
    </View>
  );
};

type InputProps<T extends FieldValues> = BaseInputProps & {
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

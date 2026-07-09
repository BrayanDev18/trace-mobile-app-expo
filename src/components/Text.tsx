import {Text as RNText, TextProps} from 'react-native';

import {cn} from '@/utils';

export function Text({className, ...props}: TextProps) {
  return <RNText className={cn('font-satoshi text-base text-primary', className)} {...props} />;
}

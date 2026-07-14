import {ReactNode} from 'react';

import {Text} from '@/components/Text';
import {cn} from '@/utils';

type SectionTitleProps = {
  children: ReactNode;
  className?: string;
};

export const SectionTitle = ({children, className}: SectionTitleProps) => (
  <Text className={cn('px-4 font-satoshi-medium text-lg', className)}>{children}</Text>
);

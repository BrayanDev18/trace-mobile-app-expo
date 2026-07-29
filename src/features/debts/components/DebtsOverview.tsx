import {useTranslation} from 'react-i18next';

import {OverviewBanner} from '@/components/OverviewBanner';
import {formatCurrency} from '@/utils';

type DebtsOverviewProps = {
  lent: number;
  owed: number;
  count: number;
  onAdd?: () => void;
};

export const DebtsOverview = (props: DebtsOverviewProps) => {
  const {lent, owed, count, onAdd} = props;
  const {t} = useTranslation();

  return (
    <OverviewBanner
      title={t('debts:overview.title')}
      amount={lent - owed}
      meta={t('debts:overview.meta', {
        count,
        lent: formatCurrency(lent),
        owed: formatCurrency(owed),
      })}
      actionLabel={t('debts:newDebt')}
      onAction={onAdd}
    />
  );
};
